import { useState } from "react";
import ModalComponent from "./ModalComponent";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { database } from "../firebase/firebaseConfig";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import EditNote from "./EditNote";

const NotesHome = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openEditDocModel, setOpenEditDocModel] = useState(false);
  const [docId, setDocId] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState("");

  const [docsData, setDocsData] = useState([]);
  const isMounted = useRef();

  const collectionRef = collection(database, "docsData");

  let navigate = useNavigate();

  const addData = () => {
    if (title === "") {
      return;
    }
    handleClose();
    addDoc(collectionRef, {
      title: title,
      docsDesc: "",
    })
      .then(() => {
        //alert("Cannot add data");
        console.log("Added title: " + title);
      })
      .catch(() => {
        alert("Cannot add data");
      });
    setTitle("");
  };

  const getData = () => {
    onSnapshot(collectionRef, (data) => {
      setDocsData(
        data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });
  };

  // function getId(id) {
  //   navigate(`/EditNote/${id}`);
  // }

  useEffect(() => {
    if (isMounted.current) {
      return;
    }
    isMounted.current = true;
    getData();
  }, []);

  function deleteItem(id) {
    const document = doc(collectionRef, id);
    deleteDoc(document, {
      title: "",
      docsDesc: "",
    });
  }
  const handleOnClick = (id) => {
    setDocId(id);
    setOpenEditDocModel(!openEditDocModel);
  };
  return (
    <Box sx={{ background: "#fff", minHeight: "100vh" }}>
      <Container
        className="docsContainer"
        sx={{
          textAlign: "center",
        }}
        fixed
      >
        <Typography
          variant="h3"
          sx={{
            paddingTop: "1rem",
            marginBottom: ".5rem",
            fontWeight: "700",
            color: "gray",
          }}
        >
          Keep Notes
        </Typography>
        <Button
          variant="outline"
          sx={{
            border: "2px solid gray",
          }}
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Take a note
        </Button>
        <ModalComponent
          open={open}
          title={title}
          setTitle={setTitle}
          addData={addData}
          handleClose={handleClose}
        />
        {openEditDocModel && (
          <EditNote
            setActiveId={setActiveId}
            setOpenEditDocModel={setOpenEditDocModel}
            openEditDocModel={openEditDocModel}
            id={docId}
          />
        )}
        <Grid
          container
          spacing={2}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            marginTop: "1rem",
          }}
        >
          {docsData.map((docData, index) => {
            return (
              <Grid
                item
                key={index}
                xs={4}
                className={`edit__model ${
                  activeId == docData.id ? "active" : ""
                }`}
              >
                <Stack
                  sx={{
                    border: "2px solid #e0e0e0",
                    borderRadius: "10px",
                    backgroundColor: "transparent",
                    padding: "1rem ",
                    height: "10rem",
                    overflowY: "auto",
                    position: "relative",
                    ":hover": {
                      boxShadow:
                        "0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)",
                    },
                  }}
                >
                  <Stack justifyContent={"center"}>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        textTransform: "capitalize",
                        color: "black",
                        textAlign: "start",
                        width: "75%",
                        wordBreak: "break-all",
                        wordWrap: "break-word",
                        lineHeight: "1rem",
                      }}
                    >
                      {docData.title}
                    </Typography>
                    <Stack
                      position={"absolute"}
                      direction={"row"}
                      spacing={0}
                      sx={{
                        color: "rgba(0,0,0,.6)",
                        right: ".5rem",
                      }}
                    >
                      <IconButton
                        aria-label="edit"
                        onClick={() => {
                          handleOnClick(docData.id);
                          setActiveId(docData.id);
                        }}
                      >
                        <BorderColorOutlinedIcon
                          sx={{
                            cursor: "pointer",
                          }}
                          fontSize="small"
                        />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => deleteItem(docData.id)}
                      >
                        <DeleteOutlineOutlinedIcon
                          sx={{
                            cursor: "pointer",
                          }}
                          fontSize="small"
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Typography
                    onClick={() => {
                      handleOnClick(docData.id);
                      setActiveId(docData.id);
                    }}
                    sx={{
                      borderRadius: "5px",
                      marginTop: "1rem",
                      color: "gray",
                      lineHeight: "1.1rem",
                      textAlignLast: "start",
                      height: "8rem",
                    }}
                    dangerouslySetInnerHTML={{ __html: docData.docsDesc }}
                  />
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default NotesHome;
