import { createMachine, assign } from 'xstate';
import axios, { AxiosResponse } from 'axios';

import { weatherMachineCity } from './WeatherMachine';

const token = process.env.RAZZLE_YOUTUBE_API_KEY;

type singleKeywordMap = {
  [key: string]: string[];
};
const weatherIconKeywordsMap: singleKeywordMap = {
  '01d': ['driv'],
  '01n': ['night'],
  '02d': ['driv'],
  '02n': ['night'],
  '03d': ['driv'],
  '03n': ['night'],
  '04d': ['driv'],
  '04n': ['night'],
  '09d': ['rain'],
  '09n': ['rain', 'night'],
  '10d': ['rain'],
  '10n': ['rain', 'night'],
  '11d': ['thunder'],
  '11n': ['thunder'],
  '13d': ['snow', 'day'],
  '13n': ['snow', 'night'],
  '50d': ['fog', 'morning'],
  '50n': ['fog', 'night'],
};

const generateKeywordFromCity = (city: weatherMachineCity) => {
  const keywords = [
    city.name,
    '4K',
    ...weatherIconKeywordsMap[city.data.icon!],
  ];
  return keywords;
};

type BackgroundMachineContext = {
  cities: weatherMachineCity[];
  videos: any[];
};

export const backgroundMachine = createMachine<BackgroundMachineContext>(
  {
    id: 'background',
    initial: 'loading',
    context: {
      cities: [],
      videos: [],
    },
    states: {
      loading: {
        invoke: {
          src: 'requestYoutubeData',
          onDone: {
            target: 'loaded',
            actions: assign({
              videos: (context, event: any) => {
                return event.data;
              },
            }),
          },
        },
      },
      loaded: {
        invoke: {
          src: 'processYoutubeData',
          onDone: 'processed',
        },
      },
      processed: {},
    },
  },
  {
    services: {
      requestYoutubeData: (context, event) => {
        const listOfRequests: Promise<AxiosResponse>[] = [];
        context.cities.forEach((city) => {
          const keywords = generateKeywordFromCity(city);

          listOfRequests.push(
            axios.get(
              `https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=relevance&q=${keywords.join(
                '%20'
              )}&type=video&videoDefinition=high&videoDimension=2d&videoEmbeddable=true&videoType=any&key=${token}`
            )
          );
        });

        return Promise.all(listOfRequests);
      },
      processYoutubeData: (context: any) => {
        // Iterate on video search results per city
        const results = context.videos.map(
          (videoResults: any, index: number) => {
            // Iterate on videos in a given request
            return videoResults.data.items.reduce(
              (chosenVideo: any, video: any) => {
                if (chosenVideo == null) {
                  let breakoutFlag = false;
                  const keywords = generateKeywordFromCity(
                    context.cities[index]
                  );
                  for (let i = 0; i < keywords.length; i++) {
                    if (
                      video.snippet.title
                        .toUpperCase()
                        .includes(keywords[i]?.toUpperCase())
                    )
                      continue;
                    else {
                      breakoutFlag = true;
                      break;
                    }
                  }

                  return breakoutFlag ? null : video.id;
                }
              },
              null
            );
          }
        );
        return results;
      },
    },
  }
);
