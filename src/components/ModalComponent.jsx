/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CssTextField from "./CssTextField";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 250,
  borderRadius: "1rem",
  bgcolor: "#fff",
  padding: "2rem",
  textAlign: "center",
};

export default function ModalComponent({
  open,
  handleClose,
  title,
  setTitle,
  addData,
}) {
  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        sx={{
          transformStyle: "preserve-3d",
        }}
      >
        <Box sx={style}>
          <CssTextField
            sx={{
              width: "100%",
            }}
            label="Add Title"
            id="custom-css-outlined-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Button
            variant="outline"
            sx={{
              marginTop: "2rem",
              paddingX: "4rem",
              border: "2px solid gray",
            }}
            onClick={addData}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
