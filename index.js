import { promises as fs } from "fs";

const start = async () => {
  try {
    // read both JSON files
    const states = JSON.parse(await fs.readFile("states.json"));
    const cities = JSON.parse(await fs.readFile("cities.json"));

    createStatesFiles(states, cities);

    const listOfTotalCitiesInEachState = await howManyCitiesInEachState(states);
    maxNumberOfCities(listOfTotalCitiesInEachState);
    minNumberOfCities(listOfTotalCitiesInEachState);

    const citiesLength = await findMaxAndMinLengthValueOfEachCityName(states);
    const maxCitiesLengthSorted = sortArrays(citiesLength.maxLenght);
    const minCitiesLengthSorted = sortArrays(citiesLength.minLength);
    logMaxLength(maxCitiesLengthSorted);
    logMinLength(minCitiesLengthSorted);
    logMaxLengthAllCities(maxCitiesLengthSorted);
    logMinLengthAllCities(minCitiesLengthSorted);
  } catch (error) {
    console.log(error);
  }
};
start();

const createStatesFiles = (states, cities) => {
  try {
    states.forEach((state) => {
      const stateFiltered = cities.filter((city) => city.Estado === state.ID);
      fs.writeFile(
        `./states/${state.Sigla}.json`,
        JSON.stringify(stateFiltered)
      );
    });
  } catch (error) {}
};

const howManyCitiesInEachState = async (states) => {
  try {
    const listOfTotalCitiesInEachState = [];
    for (const state of states) {
      const UF = state.Sigla;
      const citiesInfo = JSON.parse(await fs.readFile(`./states/${UF}.json`));
      listOfTotalCitiesInEachState.push({
        state: UF,
        stateLength: citiesInfo.length,
      });
    }
    listOfTotalCitiesInEachState.sort((a, b) => {
      return b.stateLength - a.stateLength;
    });
    return listOfTotalCitiesInEachState;
  } catch (error) {}
};

const maxNumberOfCities = (listOfTotalCitiesInEachState) => {
  console.log(listOfTotalCitiesInEachState.slice(0, 5));
};

const minNumberOfCities = (listOfTotalCitiesInEachState) => {
  console.log(
    listOfTotalCitiesInEachState.slice(
      Math.max(listOfTotalCitiesInEachState.length - 5, 0)
    )
  );
};

const findMaxAndMinLengthValueOfEachCityName = async (states) => {
  try {
    const listOfBiggerLengthCities = [];
    const listOfLessLengthCities = [];

    for (const state of states) {
      const UF = state.Sigla;
      const citiesInfo = JSON.parse(await fs.readFile(`./states/${UF}.json`));

      const citiesInfoSorted = citiesInfo.sort(
        (a, b) => b.Nome.length - a.Nome.length || b.Nome.localeCompare(a.Nome)
      );

      listOfBiggerLengthCities.push({
        state: UF,
        cityName: citiesInfoSorted[0].Nome,
        cityLength: citiesInfoSorted[0].Nome.length,
      });

      listOfLessLengthCities.push({
        state: UF,
        cityName: citiesInfoSorted[citiesInfoSorted.length - 1].Nome,
        cityLength: citiesInfoSorted[citiesInfoSorted.length - 1].Nome.length,
      });
    }
    return {
      maxLenght: listOfBiggerLengthCities,
      minLength: listOfLessLengthCities,
    };
  } catch (error) {
    console.log(error);
  }
};

const logMaxLength = (citiesLength) => {
  console.log(citiesLength);
};

const logMinLength = (citiesLength) => {
  console.log(citiesLength);
};

const logMaxLengthAllCities = (citiesLength) => {
  console.log(citiesLength[0]);
};

const logMinLengthAllCities = (citiesLength) => {
  console.log(citiesLength[citiesLength.length - 1]);
};

const sortArrays = (array) => {
  const sortedArray = array.sort(
    (a, b) =>
      b.cityName.length - a.cityName.length ||
      b.cityName.localeCompare(a.cityName)
  );
  return sortedArray;
};
