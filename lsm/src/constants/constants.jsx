import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
export const colors = {
  themeColor: "#0BC9D6",
  buttonColor1: "#006E7A",
  buttonColor2: "#8b2635",
  buttonColor3: "#9368b7",
  tableColor: "#dfbbb1",
  textColor: "#511A22",
};
export const BaseUrl = "http://localhost:5000/api";

export const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
