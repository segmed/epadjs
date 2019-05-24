// import {
//   LOAD_ANNOTATIONS,
//   LOAD_ANNOTATIONS_SUCCESS,
//   LOAD_ANNOTATIONS_ERROR,
//   UPDATE_ANNOTATION,
//   VIEWPORT_FULL,
//   TOGGLE_ALL_ANNOTATIONS,
//   TOGGLE_ALL_LABELS,
//   TOGGLE_LABEL,
//   CHANGE_ACTIVE_PORT,
//   LOAD_SERIE_SUCCESS,
//   SHOW_ANNOTATION_WINDOW /*???*/,
//   SHOW_ANNOTATION_DOCK,
//   OPEN_PROJECT_MODAL,
//   CLEAR_GRID,
//   CLEAR_SELECTION,
//   SELECT_SERIE,
//   SELECT_STUDY,
//   SELECT_PATIENT,
//   GET_PATIENT,
//   SELECT_ANNOTATION,
//   DISPLAY_SINGLE_AIM
// } from "./types";

// const initialState = {
//   openSeries: [],
//   aimsList: {},
//   activePort: null,
//   loading: false,
//   error: false,
//   patients: {},
//   listOpen: false,
//   dockOpen: false,
//   showGridFullAlert: false,
//   showProjectModal: false,
//   selectedProjects: {},
//   selectedPatients: {},
//   selectedStudies: {},
//   selectedSeries: {},
//   selectedAnnotations: {}
// };

// const asyncReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOAD_ANNOTATIONS:
//       return Object.assign({}, state, {
//         loading: true,
//         error: false
//       });
//     case LOAD_ANNOTATIONS_SUCCESS:
//       let indexKey = state.openSeries.length;
//       let { summaryData, aimsData, serID, patID, ref } = action.payload;
//       const newResult = Object.assign({}, state, {
//         patients: {
//           ...state.patients,
//           [patID]: summaryData
//         },
//         loading: false,
//         error: false,
//         activePort: indexKey,
//         aimsList: { ...state.aimsList, [serID]: aimsData },
//         openSeries: state.openSeries.concat([ref])
//       });

//       return newResult;
//     case VIEWPORT_FULL:
//       const viewPortStatus = !state.showGridFullAlert;
//       return { ...state, showGridFullAlert: viewPortStatus };
//     case OPEN_PROJECT_MODAL:
//       const projectModalStatus = !state.showProjectModal;
//       return { ...state, showProjectModal: projectModalStatus };
//     case LOAD_SERIE_SUCCESS:
//       let indexNum = state.openSeries.length;
//       const ptID = action.payload.ref.patientID;
//       const stID = action.payload.ref.studyUID;
//       const srID = action.payload.ref.seriesUID;
//       const { ann } = action.payload;
//       let changedPatient = Object.assign({}, state.patients[ptID]);

//       if (ann) {
//         changedPatient.studies[stID].series[srID].annotations[
//           ann
//         ].isDisplayed = true;
//       } else {
//         changedPatient.studies[stID].series[srID].displayAnns = true;
//         for (let annotation in changedPatient.studies[stID].series[srID]
//           .annotations) {
//           changedPatient.studies[stID].series[srID].annotations[
//             annotation
//           ].isDisplayed = true;
//         }
//       }
//       const changedPatients = { ...state.patients, [ptID]: changedPatient };
//       const result = Object.assign({}, state, {
//         loading: false,
//         error: false,
//         activePort: indexNum,
//         aimsList: {
//           ...state.aimsList,
//           [action.payload.serID]: action.payload.aimsData
//         },
//         openSeries: state.openSeries.concat([action.payload.ref]),
//         patients: changedPatients
//       });

//       return result;
//     case LOAD_ANNOTATIONS_ERROR:
//       return Object.assign({}, state, {
//         loading: false,
//         error: action.error
//       });
//     case UPDATE_ANNOTATION:
//       let { serie, study, patient, annotation, isDisplayed } = action.payload;
//       let updatedPatient = Object.assign({}, state.patients[patient]);

//       let updatedSerieAimArr = Object.values(
//         updatedPatient.studies[study].series[serie].annotations
//       );
//       updatedSerieAimArr.forEach(ann => {
//         if (ann.aimID === annotation) {
//           ann.isDisplayed = isDisplayed;
//         }
//       });

//       const newPatients = {
//         ...state.patients,
//         [patient]: updatedPatient
//       };
//       return Object.assign({}, state, {
//         aimsList: {
//           ...state.aimsList,
//           [serie]: {
//             ...state.aimsList[serie],
//             [annotation]: {
//               ...state.aimsList[serie][annotation],
//               isDisplayed
//             }
//           }
//         },
//         patients: newPatients
//       });
//     case CHANGE_ACTIVE_PORT:
//       return Object.assign({}, state, { activePort: action.portIndex });
//     case SHOW_ANNOTATION_WINDOW:
//       const showStatus = state.listOpen;
//       return Object.assign({}, state, { listOpen: !showStatus });
//     case SHOW_ANNOTATION_DOCK:
//       const displayAnnDock = state.dockOpen;
//       return Object.assign({}, state, { dockOpen: !displayAnnDock });
//     case TOGGLE_ALL_ANNOTATIONS:
//       //update openSeries
//       let { patientID, studyID, serieID, displayStatus } = action.payload;
//       let toggleAnnPatients = Object.assign({}, state.patients);
//       const newSerie =
//         toggleAnnPatients[patientID].studies[studyID].series[serieID];
//       let annotationsInSerie = newSerie.annotations;
//       for (let ann in annotationsInSerie) {
//         annotationsInSerie[ann].isDisplayed = displayStatus;
//       }
//       const newValue = !toggleAnnPatients[patientID].studies[studyID].series[
//         serieID
//       ].displayAnns;
//       newSerie.displayAnns = newValue;
//       if (!newValue) {
//       }
//       return Object.assign({}, state, { patients: toggleAnnPatients });
//     case TOGGLE_ALL_LABELS:
//       const toggledLabelSerie = { ...state.aimsList };
//       const anns = toggledLabelSerie[action.payload.serieID];
//       for (let ann in anns) {
//         anns[ann].showLabel = action.payload.checked;
//       }
//       return Object.assign({}, state, { aimsList: toggledLabelSerie });
//     case TOGGLE_LABEL:
//       const singleLabelToggled = { ...state.aimsList };
//       const allAnns = singleLabelToggled[action.payload.serieID];
//       for (let ann in allAnns) {
//         if (ann === action.payload.aimID) {
//           const currentStatus = allAnns[ann].showLabel;
//           allAnns[ann].showLabel = !currentStatus;
//         }
//       }
//       return Object.assign({}, state, { aimsList: singleLabelToggled });
//     case CLEAR_GRID:
//       const clearedPatients = {};
//       let selectionObj = [];
//       if (Object.keys(state.selectedStudies).length > 0) {
//         selectionObj = { ...state.selectedStudies };
//       } else if (Object.keys(state.selectedSeries).length > 0) {
//         selectionObj = { ...state.selectedSeries };
//       } else {
//         selectionObj = { ...state.selectedAnnotations };
//       }

//       //keep the patient if already there
//       for (let item in selectionObj) {
//         if (state.patients[item.patientID]) {
//           clearedPatients[item.patientID] = {
//             ...state.patients[item.patientID]
//           };
//         }
//       }

//       //update the state as not displayed
//       for (let patient in clearedPatients) {
//         for (let study in clearedPatients[patient]) {
//           for (let serie in clearedPatients[patient].studies[study]) {
//             serie.displayAnns = false;
//             for (let ann in clearedPatients[patient].studies[study].series[
//               serie
//             ]) {
//               ann.isDisplayed = false;
//             }
//           }
//         }
//       }

//       return {
//         ...state,
//         patients: clearedPatients,
//         openSeries: [],
//         aimsList: {},
//         activePort: 0
//       };
//     case CLEAR_SELECTION:
//       let selectionState = { ...state };
//       if (action.selectionType === "annotation") {
//         selectionState.selectedSeries = {};
//         selectionState.selectedStudies = {};
//         selectionState.selectedPatients = {};
//       } else if (action.selectionType === "serie") {
//         selectionState.selectedAnnotations = {};
//         selectionState.selectedStudies = {};
//         selectionState.selectedPatients = {};
//       } else if (action.selectionType === "study") {
//         selectionState.selectedAnnotations = {};
//         selectionState.selectedSeries = {};
//         selectionState.selectedPatients = {};
//       } else if (action.selectionType === "patient") {
//         selectionState.selectedAnnotations = {};
//         selectionState.selectedSeries = {};
//         selectionState.selectedStudies = {};
//       } else {
//         selectionState.selectedAnnotations = {};
//         selectionState.selectedSeries = {};
//         selectionState.selectedStudies = {};
//         selectionState.selectedPatients = {};
//       }
//       return selectionState;
//     case SELECT_PATIENT:
//       console.log("in reducer");
//       let patientsNew = {
//         ...state.selectedPatients
//       };
//       patientsNew[action.patient.subjectID]
//         ? delete patientsNew[action.patient.subjectID]
//         : (patientsNew[action.patient.subjectID] = action.patient);
//       return { ...state, selectedPatients: patientsNew };
//     case SELECT_STUDY:
//       let newStudies = {
//         ...state.selectedStudies
//       };
//       newStudies[action.study.studyUID]
//         ? delete newStudies[action.study.studyUID]
//         : (newStudies[action.study.studyUID] = action.study);
//       return { ...state, selectedStudies: newStudies };
//     case SELECT_SERIE:
//       let newSeries = {
//         ...state.selectedSeries
//       };
//       newSeries[action.serie.seriesUID]
//         ? delete newSeries[action.serie.seriesUID]
//         : (newSeries[action.serie.seriesUID] = action.serie);
//       // state.selectedStudies.concat([action.study]);
//       return { ...state, selectedSeries: newSeries };
//     case SELECT_ANNOTATION:
//       let newAnnotations = {
//         ...state.selectedAnnotations
//       };
//       newAnnotations[action.annotation.aimID]
//         ? delete newAnnotations[action.annotation.aimID]
//         : (newAnnotations[action.annotation.aimID] = action.annotation);
//       return { ...state, selectedAnnotations: newAnnotations };
//     case GET_PATIENT:
//       let addedNewPatient = { ...state.patients };
//       addedNewPatient[action.patient.patientID] = action.patient;
//       return { ...state, patients: addedNewPatient };
//     case DISPLAY_SINGLE_AIM:
//       let aimPatient = { ...state.patients[action.payload.patientID] };
//       let aimOpenSeries = [...state.openSeries];
//       let aimAimsList = { ...state.aimsList[action.payload.seriesUID] };
//       //update patient data
//       for (let stItem in aimPatient.studies) {
//         if (stItem === action.payload.studyUID) {
//           for (let srItem in aimPatient.studies[stItem].series) {
//             if (srItem === action.payload.seriesUID) {
//               for (let annItem in aimPatient.studies[stItem].series[srItem]
//                 .annotations) {
//                 if (annItem === action.payload.aimID) {
//                   aimPatient.studies[stItem].series[srItem].annotations[
//                     annItem
//                   ].isDisplayed = true;
//                 } else {
//                   aimPatient.studies[stItem].series[srItem].annotations[
//                     annItem
//                   ].isDisplayed = false;
//                 }
//               }
//             }
//           }
//         }
//       }
//       //update aimsList data
//       let allAims = Object.keys(
//         aimPatient.studies[action.payload.studyUID].series[
//           action.payload.seriesUID
//         ].annotations
//       );

//       allAims.forEach(ann => {
//         if (ann === action.payload.aimID) {
//           aimAimsList[ann].isDisplayed = true;
//           aimAimsList[ann].showLabel = true;
//         } else {
//           aimAimsList[ann].isDisplayed = false;
//           aimAimsList[ann].showLabel = false;
//         }
//       });

//       //update Openseries data
//       aimOpenSeries.forEach(item => {
//         if (item.seriesUID === action.payload.seriesUID) {
//           item.aimID = action.payload.aimID;
//         }
//       });
//       return {
//         ...state,
//         aimsList: {
//           ...state.aimsList,
//           [action.payload.seriesUID]: aimAimsList
//         },
//         patients: { ...state.patients, [action.payload.patientID]: aimPatient },
//         openSeries: aimOpenSeries
//       };
//     default:
//       return state;
//   }
// };

// export default asyncReducer;
import {
  LOAD_ANNOTATIONS,
  LOAD_ANNOTATIONS_SUCCESS,
  LOAD_ANNOTATIONS_ERROR,
  LOAD_PATIENT,
  LOAD_PATIENT_SUCCESS,
  LOAD_PATIENT_ERROR,
  UPDATE_ANNOTATION_DISPLAY,
  VIEWPORT_FULL,
  TOGGLE_ALL_ANNOTATIONS,
  TOGGLE_ALL_LABELS,
  TOGGLE_LABEL,
  CHANGE_ACTIVE_PORT,
  LOAD_SERIE_SUCCESS,
  SHOW_ANNOTATION_WINDOW /*???*/,
  SHOW_ANNOTATION_DOCK,
  OPEN_PROJECT_MODAL,
  CLEAR_GRID,
  CLEAR_SELECTION,
  SELECT_SERIE,
  SELECT_STUDY,
  SELECT_PATIENT,
  GET_PATIENT,
  SELECT_ANNOTATION,
  LOAD_COMPLETED,
  START_LOADING,
  ADD_TO_GRID,
<<<<<<< HEAD
  DISPLAY_SINGLE_AIM
=======
  DISPLAY_SINGLE_AIM,
  JUMP_TO_AIM,
  UPDATE_PATIENT,
  CLOSE_SERIE
>>>>>>> master
} from "./types";
const initialState = {
  openSeries: [],

  aimsList: {},

  activePort: null,

  loading: false,

  error: false,

  patients: {},

  listOpen: false,

  dockOpen: false,

  showGridFullAlert: false,

  showProjectModal: false,

  selectedProjects: {},

  selectedPatients: {},

  selectedStudies: {},

  selectedSeries: {},
<<<<<<< HEAD

  selectedAnnotations: {}
=======
  selectedAnnotations: {},
  patientLoading: false,
  patientLoadingError: null
>>>>>>> master
};

const asyncReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLOSE_SERIE:
      let delSeriesUID = action.payload.serie.seriesUID;
      let delStudyUID = action.payload.serie.studyUID;
      let delPatientID = action.payload.serie.patientID;
      const delAims = { ...state.aimsList };
      delete delAims[delSeriesUID];
      let delGrid = state.openSeries.slice(0, action.payload.index);
      delGrid = delGrid.concat(
        state.openSeries.slice(action.payload.index + 1)
      );
      let shouldPatientExist = false;
      for (let item of delGrid) {
        if (item.patientID === delPatientID) {
          shouldPatientExist = true;
          break;
        }
      }
      const delPatients = { ...state.patients };
      if (shouldPatientExist) {
        delPatients[delPatientID].studies[delStudyUID].series[
          delSeriesUID
        ].isDisplayed = false;
      } else {
        delete delPatients[delPatientID];
      }
      let delActivePort;
      if (delGrid.length === 0) {
        delActivePort = null;
      } else {
        delActivePort = delGrid.length - 1;
      }
      return {
        ...state,
        openSeries: delGrid,
        aimsList: delAims,
        patients: delPatients,
        activePort: delActivePort
      };
    case LOAD_ANNOTATIONS:
      return Object.assign({}, state, {
        loading: true,

        error: false
      });

    case LOAD_ANNOTATIONS_SUCCESS:
      let indexKey = state.openSeries.length - 1;
<<<<<<< HEAD

=======
>>>>>>> master
      let { summaryData, aimsData, serID, patID, ref } = action.payload;

      const newResult = Object.assign({}, state, {
        patients: {
          ...state.patients,

          [patID]: summaryData
        },

        loading: false,

        error: false,

        activePort: indexKey,

        aimsList: { ...state.aimsList, [serID]: aimsData },

        openSeries: state.openSeries.concat([ref])
      });
      return newResult;

    case VIEWPORT_FULL:
      const viewPortStatus = !state.showGridFullAlert;

      return { ...state, showGridFullAlert: viewPortStatus };

    case OPEN_PROJECT_MODAL:
      const projectModalStatus = !state.showProjectModal;

      return { ...state, showProjectModal: projectModalStatus };

    case LOAD_SERIE_SUCCESS:
      let indexNum = state.openSeries.length - 1;
<<<<<<< HEAD

=======
>>>>>>> master
      const ptID = action.payload.ref.patientID;

      const stID = action.payload.ref.studyUID;

      const srID = action.payload.ref.seriesUID;

      const { ann } = action.payload;
<<<<<<< HEAD

      let changedPatients;

      if (state.patients[ptID]) {
        let changedPatient = Object.assign({}, state.patients[ptID]);

        if (ann) {
          changedPatient.studies[stID].series[srID].annotations[
            ann
          ].isDisplayed = true;
        } else {
          changedPatient.studies[stID].series[srID].displayAnns = true;

          for (let annotation in changedPatient.studies[stID].series[srID]
            .annotations) {
            changedPatient.studies[stID].series[srID].annotations[
              annotation
            ].isDisplayed = true;
          }
        }

        changedPatients = { ...state.patients, [ptID]: changedPatient };
      }

=======
      let changedPatients;
>>>>>>> master
      const result = Object.assign({}, state, {
        loading: false,

        error: false,

        activePort: indexNum,

        aimsList: {
          ...state.aimsList,

          [action.payload.serID]: action.payload.aimsData
        }
<<<<<<< HEAD

        // openSeries: state.openSeries.concat([action.payload.ref])
      });

      return !changedPatients
        ? result
        : { ...result, patients: changedPatients };

=======
      });
      return !changedPatients
        ? result
        : { ...result, patients: changedPatients };
>>>>>>> master
    case LOAD_ANNOTATIONS_ERROR:
      return Object.assign({}, state, {
        loading: false,

        error: action.error
      });
<<<<<<< HEAD

    case UPDATE_ANNOTATION:
      let { serie, study, patient, annotation, isDisplayed } = action.payload;

      let updatedPatient = Object.assign({}, state.patients[patient]);

      let updatedSerieAimArr = Object.values(
        updatedPatient.studies[study].series[serie].annotations
      );

      updatedSerieAimArr.forEach(ann => {
        if (ann.aimID === annotation) {
          ann.isDisplayed = isDisplayed;
        }
      });

      const newPatients = {
        ...state.patients,

        [patient]: updatedPatient
      };

=======
    case UPDATE_ANNOTATION_DISPLAY:
      let { patient, study, serie, annotation, isDisplayed } = action.payload;
>>>>>>> master
      return Object.assign({}, state, {
        aimsList: {
          ...state.aimsList,

          [serie]: {
            ...state.aimsList[serie],

            [annotation]: {
              ...state.aimsList[serie][annotation],

              isDisplayed
            }
          }
<<<<<<< HEAD
        },

        patients: newPatients
=======
        }
>>>>>>> master
      });

    case CHANGE_ACTIVE_PORT:
      return Object.assign({}, state, { activePort: action.portIndex });

    case SHOW_ANNOTATION_WINDOW:
      const showStatus = state.listOpen;

      return Object.assign({}, state, { listOpen: !showStatus });

    case SHOW_ANNOTATION_DOCK:
      const displayAnnDock = state.dockOpen;

      return Object.assign({}, state, { dockOpen: !displayAnnDock });

    case TOGGLE_ALL_ANNOTATIONS:
      //update openSeries
<<<<<<< HEAD

      let { patientID, studyID, serieID, displayStatus } = action.payload;

      let toggleAnnPatients = Object.assign({}, state.patients);

      const newSerie =
        toggleAnnPatients[patientID].studies[studyID].series[serieID];

      let annotationsInSerie = newSerie.annotations;

      for (let ann in annotationsInSerie) {
        annotationsInSerie[ann].isDisplayed = displayStatus;
      }

      const newValue = !toggleAnnPatients[patientID].studies[studyID].series[
        serieID
      ].displayAnns;

      newSerie.displayAnns = newValue;

      if (!newValue) {
      }

      return Object.assign({}, state, { patients: toggleAnnPatients });

=======
      let { seriesUID, displayStatus } = action.payload;
      let toggleAnns = Object.assign({}, state.aimsList);
      for (let ann in toggleAnns[seriesUID]) {
        toggleAnns[seriesUID][ann].isDisplayed = displayStatus;
      }
      return Object.assign({}, state, {
        aimsList: toggleAnns
      });
>>>>>>> master
    case TOGGLE_ALL_LABELS:
      const toggledLabelSerie = { ...state.aimsList };

      const anns = toggledLabelSerie[action.payload.serieID];

      for (let ann in anns) {
        anns[ann].showLabel = action.payload.checked;
      }

      return Object.assign({}, state, { aimsList: toggledLabelSerie });

    case TOGGLE_LABEL:
      const singleLabelToggled = { ...state.aimsList };

      const allAnns = singleLabelToggled[action.payload.serieID];

      for (let ann in allAnns) {
        if (ann === action.payload.aimID) {
          const currentStatus = allAnns[ann].showLabel;

          allAnns[ann].showLabel = !currentStatus;
        }
      }

      return Object.assign({}, state, { aimsList: singleLabelToggled });

    case CLEAR_GRID:
      const clearedPatients = {};

      let selectionObj = [];

      if (Object.keys(state.selectedStudies).length > 0) {
        selectionObj = { ...state.selectedStudies };
      } else if (Object.keys(state.selectedSeries).length > 0) {
        selectionObj = { ...state.selectedSeries };
      } else {
        selectionObj = { ...state.selectedAnnotations };
      }

      //keep the patient if already there

      for (let item in selectionObj) {
        if (state.patients[item.patientID]) {
          clearedPatients[item.patientID] = {
            ...state.patients[item.patientID]
          };
        }
      }

      //update the state as not displayed

      for (let patient in clearedPatients) {
        for (let study in clearedPatients[patient]) {
          for (let serie in clearedPatients[patient].studies[study]) {
<<<<<<< HEAD
            serie.displayAnns = false;

=======
            serie.isDisplayed = false;
>>>>>>> master
            for (let ann in clearedPatients[patient].studies[study].series[
              serie
            ]) {
              ann.isDisplayed = false;
            }
          }
        }
      }

      return {
        ...state,

        patients: clearedPatients,

        openSeries: [],

        aimsList: {},

        activePort: 0
      };

    case CLEAR_SELECTION:
      let selectionState = { ...state };

      if (action.selectionType === "annotation") {
        selectionState.selectedSeries = {};

        selectionState.selectedStudies = {};

        selectionState.selectedPatients = {};
      } else if (action.selectionType === "serie") {
        selectionState.selectedAnnotations = {};

        selectionState.selectedStudies = {};

        selectionState.selectedPatients = {};
      } else if (action.selectionType === "study") {
        selectionState.selectedAnnotations = {};

        selectionState.selectedSeries = {};

        selectionState.selectedPatients = {};
      } else if (action.selectionType === "patient") {
        selectionState.selectedAnnotations = {};

        selectionState.selectedSeries = {};

        selectionState.selectedStudies = {};
      } else {
        selectionState.selectedAnnotations = {};

        selectionState.selectedSeries = {};

        selectionState.selectedStudies = {};

        selectionState.selectedPatients = {};
      }

      return selectionState;

    case SELECT_PATIENT:
<<<<<<< HEAD
      console.log("in reducer");

=======
>>>>>>> master
      let patientsNew = {
        ...state.selectedPatients
      };

      patientsNew[action.patient.subjectID]
        ? delete patientsNew[action.patient.subjectID]
        : (patientsNew[action.patient.subjectID] = action.patient);

      return { ...state, selectedPatients: patientsNew };

    case SELECT_STUDY:
      let newStudies = {
        ...state.selectedStudies
      };

      newStudies[action.study.studyUID]
        ? delete newStudies[action.study.studyUID]
        : (newStudies[action.study.studyUID] = action.study);

      return { ...state, selectedStudies: newStudies };
<<<<<<< HEAD

    case LOAD_COMPLETED:
      console.log("completed reducer");

      return { ...state, loading: false };

    case START_LOADING:
      console.log("start reducer");

      return { ...state, loading: true };

=======
    case LOAD_COMPLETED:
      return { ...state, loading: false };
    case START_LOADING:
      return { ...state, loading: true };
>>>>>>> master
    case SELECT_SERIE:
      let newSeries = {
        ...state.selectedSeries
      };

      newSeries[action.serie.seriesUID]
        ? delete newSeries[action.serie.seriesUID]
        : (newSeries[action.serie.seriesUID] = action.serie);

      // state.selectedStudies.concat([action.study]);

      return { ...state, selectedSeries: newSeries };

    case SELECT_ANNOTATION:
      let newAnnotations = {
        ...state.selectedAnnotations
      };

      newAnnotations[action.annotation.aimID]
        ? delete newAnnotations[action.annotation.aimID]
        : (newAnnotations[action.annotation.aimID] = action.annotation);

      return { ...state, selectedAnnotations: newAnnotations };
<<<<<<< HEAD

    case GET_PATIENT:
=======
    case LOAD_PATIENT:
      return { ...state, patientLoading: true };
    case LOAD_PATIENT_ERROR:
      return {
        ...state,
        patientLoadingError: action.err,
        patientLoading: false
      };
    case LOAD_PATIENT_SUCCESS:
>>>>>>> master
      let addedNewPatient = { ...state.patients };

      addedNewPatient[action.patient.patientID] = action.patient;
<<<<<<< HEAD

      return {
        ...state,

        patients: addedNewPatient,

        loading: false,

        error: false
      };

=======
      return {
        ...state,
        patients: addedNewPatient,
        patientLoading: false,
        patientLoadingError: false
      };
>>>>>>> master
    case DISPLAY_SINGLE_AIM:
      let aimPatient = { ...state.patients[action.payload.patientID] };

      let aimOpenSeries = [...state.openSeries];

      let aimAimsList = { ...state.aimsList[action.payload.seriesUID] };

      //update patient data

      for (let stItem in aimPatient.studies) {
        if (stItem === action.payload.studyUID) {
          for (let srItem in aimPatient.studies[stItem].series) {
            if (srItem === action.payload.seriesUID) {
              for (let annItem in aimPatient.studies[stItem].series[srItem]
                .annotations) {
                if (annItem === action.payload.aimID) {
                  aimPatient.studies[stItem].series[srItem].annotations[
                    annItem
                  ].isDisplayed = true;
                } else {
                  aimPatient.studies[stItem].series[srItem].annotations[
                    annItem
                  ].isDisplayed = false;
                }
              }
            }
          }
        }
      }

      //update aimsList data

      let allAims = Object.keys(
        aimPatient.studies[action.payload.studyUID].series[
          action.payload.seriesUID
        ].annotations
      );

      allAims.forEach(ann => {
        if (ann === action.payload.aimID) {
          aimAimsList[ann].isDisplayed = true;

          aimAimsList[ann].showLabel = true;
        } else {
          aimAimsList[ann].isDisplayed = false;

          aimAimsList[ann].showLabel = false;
        }
      });

      //update Openseries data
<<<<<<< HEAD

      aimOpenSeries.forEach(item => {
        if (item.seriesUID === action.payload.seriesUID) {
          item.aimID = action.payload.aimID;
        }
      });
=======
      aimOpenSeries[action.payload.index].aimID = action.payload.aimID;
>>>>>>> master

      return {
        ...state,

        aimsList: {
          ...state.aimsList,

          [action.payload.seriesUID]: aimAimsList
        },

        patients: { ...state.patients, [action.payload.patientID]: aimPatient },

        openSeries: aimOpenSeries
      };
<<<<<<< HEAD

    case ADD_TO_GRID:
      console.log("here");

      let newOpenSeries = state.openSeries.concat(action.reference);

      return { ...state, openSeries: newOpenSeries };

=======
    case ADD_TO_GRID:
      let newOpenSeries = state.openSeries.concat(action.reference);
      return { ...state, openSeries: newOpenSeries };
    case UPDATE_PATIENT:
      let updatedPt = { ...state.patients[action.payload.patient] };
      if (action.payload.type === "study") {
        let selectedSt = updatedPt.studies[action.payload.study];
        for (let serie in selectedSt.series) {
          selectedSt.series[serie].isDisplayed = action.payload.status;
        }
      } else if (
        action.payload.type === "serie" ||
        action.payload.type === "annotation"
      ) {
        let selectedSr =
          updatedPt.studies[action.payload.study].series[action.payload.serie];
        selectedSr.isDisplayed = action.payload.status;
        for (let ann in selectedSr.annotations) {
          selectedSr.annotations[ann].isDisplayed = action.payload.status;
        }
      }
      let updatedPtPatients = { ...state.patients };
      updatedPtPatients[action.payload.patient] = updatedPt;
      return { ...state, patients: updatedPtPatients };
    case JUMP_TO_AIM:
      let { aimID, index } = action.payload;
      let serUID = action.payload.seriesUID;
      let updatedGrid = [...state.openSeries];
      updatedGrid[index].aimID = aimID;

      // return { ...state, openSeries: updatedGrid, aimsList: {...state.aimsList} };
      return Object.assign({}, state, {
        openSeries: updatedGrid,
        aimsList: {
          ...state.aimsList,
          [serUID]: {
            ...state.aimsList[serUID],
            [aimID]: {
              ...state.aimsList[serUID][aimID],
              isDisplayed: true
            }
          }
        }
      });
>>>>>>> master
    default:
      return state;
  }
};

export default asyncReducer;
