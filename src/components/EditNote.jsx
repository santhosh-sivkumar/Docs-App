import Box from "@mui/material/Box";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebaseConfig";
import Modal from "@mui/material/Modal";

const EditNote = (props) => {
  const [docsDescription, setDocsDescription] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  let params;
  if (props.id) {
    params = props;
  }

  const isMounted = useRef();

  const collectionRef = collection(database, "docsData");

  function getQuillData(value) {
    setDocsDescription(value);
  }

  useEffect(() => {
    const updateDocsData = setTimeout(() => {
      const document = doc(collectionRef, params.id);
      updateDoc(document, {
        title: documentTitle,
        docsDesc: docsDescription,
      }).catch(() => {
        alert("Cannot Save");
      });
    }, 500);
    return () => clearTimeout(updateDocsData);
  }, [docsDescription, params.id, collectionRef]);

  const getData = () => {
    const document = doc(collectionRef, params.id);
    onSnapshot(document, (docs) => {
      setDocumentTitle(docs.data().title);
      setDocsDescription(docs.data().docsDesc);
    });
  };

  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    isMounted.current = true;
    getData();
  }, []);

  return (
    <Modal
      onClose={() => {
        props.setOpenEditDocModel(false);

        props.setActiveId(null);
      }}
      open={props.openEditDocModel}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      sx={{
        transformStyle: "revert-layer",
        transition: "2s",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 100,
          borderRadius: ".5rem",
          border: "0",
          bgcolor: "#fff",
          padding: "1.5rem",
          textAlign: "start",
          maxWidth: "50vw",
        }}
      >
        <TextField
          sx={{
            width: "100%",
          }}
          variant="standard"
          placeholder="Title"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
        />
        <div dangerouslySetInnerHTML={{ __html: doc.docsDesc }} />
        <ReactQuill
          style={{
            border: "2px solid gray",
            margin: "1rem 0 0 0",
          }}
          value={docsDescription}
          onChange={getQuillData}
        />
      </Box>
    </Modal>
  );
};

export default EditNote;
