import * as React from "react";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Symptoms = [
  { title: "fever", id: 0 },
  { title: "respiratory_symptoms", id: 1 },
  { title: "sneeze", id: 2 },
  { title: "cough", id: 3 },
  { title: "runny_nose", id: 4 },
  { title: "muscle_aches", id: 5 },
  { title: "headache", id: 6 },
  { title: "fatigue", id: 7 },
  { title: "diarrhea", id: 8 },
  { title: "vomiting", id: 9 },
  { title: "chest_pain", id: 10 },
  { title: "stomachache", id: 11 },
  { title: "sore_throat", id: 12 },
  { title: "itchy_eyes", id: 13 },
  { title: "loss_of_appetite", id: 14 },
  { title: "loss_of_sense_of_smell", id: 15 },
];

const diseases = [
  {
    disease: "covid-19",
    symptoms: [
      1, 1, 0, 1, 0, 0.75, 1, 0.75, 0.75, 0.75, 0.75, 0, 1, 0.25, 0.5, 1,
    ],
  },
  {
    disease: "flu",
    symptoms: [
      0.75, 0.75, 1, 0.75, 1, 1, 0.75, 1, 1, 1, 1, 0, 0.75, 0.5, 0.25, 0,
    ],
  },
  {
    disease: "common_cold",
    symptoms: [
      0.5, 0.75, 0.75, 0.75, 0.75, 0, 0.5, 0, 0, 0, 0, 0, 0.75, 0.25, 0.25, 0,
    ],
  },
  {
    disease: "bronchitis",
    symptoms: [0.5, 0.75, 0, 0.75, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0],
  },
  {
    disease: "RSV",
    symptoms: [0.5, 0.75, 0, 0.75, 0.75, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0],
  },
];

const calculateSymptomProbability = (disease, symptomIndex) => {
  return diseases.find((d) => d.disease === disease).symptoms[symptomIndex];
};

export default function FixedTags() {
  const fixedOptions = [];
  const [value, setValue] = React.useState([...fixedOptions]);
  const [result, setResult] = React.useState(null);

  function handleClick() {
    const userSymptoms = value.reduce((acc, curr) => {
      acc[curr.title] = true;
      return acc;
    }, {});

    const symptomIndices = Symptoms.map((symptom, index) => ({
      symptom,
      index,
    })).filter((item) => userSymptoms[item.symptom.title]);

    const diseaseProbabilities = diseases.map((diseaseObj) => {
      let probability = 1;
      symptomIndices.forEach(({ index }) => {
        probability *= calculateSymptomProbability(diseaseObj.disease, index);
      });
      return {
        disease: diseaseObj.disease,
        probability,
      };
    });

    const mostProbableDisease = diseaseProbabilities.reduce(
      (max, dp) => (dp.probability > max.probability ? dp : max),
      diseaseProbabilities[0]
    );

    setResult(mostProbableDisease.disease);
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        gap: 3,
        flexDirection: "column",
        p: 1,
        m: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
      }}
    >
      <Autocomplete
        multiple
        id="fixed-tags-demo"
        value={value}
        onChange={(event, newValue) => {
          setValue([
            ...fixedOptions,
            ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
          ]);
        }}
        options={Symptoms}
        getOptionLabel={(option) => option.title}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip label={option.title} {...getTagProps({ index })} />
          ))
        }
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField {...params} label="Symptoms" placeholder="Add Symptoms" />
        )}
      />

      <Button variant="contained" onClick={handleClick}>
        Send
      </Button>

      {result && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            width: "100%",
            maxWidth: 500,
            textAlign: "left",
          }}
        >
          <h2>Most Probable Disease:</h2>
          <p>{result}</p>
        </Box>
      )}
    </Box>
  );
}
