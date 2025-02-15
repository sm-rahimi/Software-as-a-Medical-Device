import * as React from "react";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const Symptoms = [
  { title: "fever", id: 0 },
  { title: "respiratory symptoms", id: 1 },
  { title: "sneeze", id: 2 },
  { title: "cough", id: 3 },
  { title: "runny nose", id: 4 },
  { title: "muscle aches", id: 5 },
  { title: "headache", id: 6 },
  { title: "fatigue", id: 7 },
  { title: "diarrhea", id: 8 },
  { title: "vomiting", id: 9 },
  { title: "chest pain", id: 10 },
  { title: "stomachache", id: 11 },
  { title: "sore throat", id: 12 },
  { title: "itchy eyes", id: 13 },
  { title: "loss of appetite", id: 14 },
  { title: "loss of sense of smell", id: 15 },
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
    disease: "common cold",
    symptoms: [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    disease: "bronchitis",
    symptoms: [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  },
  {
    disease: "RSV",
    symptoms: [0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  },
];

const calculateSymptomProbability = (disease, symptomIndex) => {
  return diseases.find((d) => d.disease === disease).symptoms[symptomIndex];
};

export default function FixedTags() {
  const fixedOptions = [];
  const [value, setValue] = React.useState([...fixedOptions]);
  const [result, setResult] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(true);
  }, []);

  const handleClick = () => {
    if (value.length === 0) {
      alert("Please select at least one symptom.");
      return;
    }

    const userSymptoms = value.reduce((acc, curr) => {
      acc[curr.title] = true;
      return acc;
    }, {});

    const symptomIndices = Symptoms.map((symptom, index) => ({
      symptom,
      index,
    })).filter((item) => userSymptoms[item.symptom.title]);

    console.log("Selected Symptom Indices:", symptomIndices);

    const diseaseProbabilities = diseases.map((diseaseObj) => {
      let probability = 1;
      symptomIndices.forEach(({ index }) => {
        const symptomProbability = calculateSymptomProbability(
          diseaseObj.disease,
          index
        );
        console.log(
          `Calculating for ${diseaseObj.disease}: symptom index ${index}, probability ${symptomProbability}`
        );
        probability *= symptomProbability;
      });
      return {
        disease: diseaseObj.disease,
        probability,
      };
    });

    console.log("Disease Probabilities:", diseaseProbabilities);

    const mostProbableDisease = diseaseProbabilities.reduce(
      (max, dp) => (dp.probability > max.probability ? dp : max),
      { disease: "", probability: 0 }
    );

    console.log("Most Probable Disease:", mostProbableDisease);

    setResult(
      mostProbableDisease.disease ||
      "No matching disease found."
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <React.Fragment>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Warning
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Typography gutterBottom>
              A. Please consult a healthcare provider for a reliable diagnosis
              as well as appropriate treatment.
            </Typography>
            <Typography gutterBottom>
              B. Do not use the application if you suffer from serious diseases
              like cancer etc.
            </Typography>
            <Typography gutterBottom>
              C. Don't use the application if you suffer from more symptoms than
              electable. Select your exact set of symptoms, not more, not less.
            </Typography>
            <Typography gutterBottom>
              D. The application only provides information on the specified
              diseases. Don't use it for diagnosis regarding any other
              diseases/mental health conditions.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Accept and Use
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
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
              ...newValue.filter(
                (option) => fixedOptions.indexOf(option) === -1
              ),
            ]);
          }}
          options={Symptoms}
          getOptionLabel={(option) => option.title}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip label={option.title} {...getTagProps({ index })} />
            ))
          }
          sx={{
            width: "90%",
            maxWidth: "500px",
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Symptoms"
              placeholder="Add Symptoms"
            />
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
    </>
  );
}
