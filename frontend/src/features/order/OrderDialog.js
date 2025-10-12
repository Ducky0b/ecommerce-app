import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateStatusOrder } from "./orderSlice";
import { FormProvider, FTextField } from "../../components/form";

function OrderDialog({
  openDialog,
  dialogType,
  handleCloseDialog,
  selectedOrder,
}) {
  const dispatch = useDispatch();
  const defaultValues = {
    status: "pending",
  };
  const methods = useForm({ defaultValues });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (openDialog && selectedOrder) {
      reset({
        status: selectedOrder.status || "pending",
      });
    }
  }, [openDialog, selectedOrder, reset]);

  const onSubmit = (data) => {
    if (selectedOrder) {
      dispatch(
        updateStatusOrder({
          id: selectedOrder._id,
          status: data.status,
        })
      );
    }
    handleCloseDialog();
  };
  return (
    <Dialog
      open={openDialog && dialogType === "editOrder"}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <FTextField
            name="status"
            label="Trạng thái"
            select
            margin="dense"
            disabled={selectedOrder.status == "cancelled"}
            fullWidth
          >
            <MenuItem value="pending">Chờ xử lý</MenuItem>
            <MenuItem value="processing">Đang xử lý</MenuItem>
            <MenuItem value="shipping">Đang vận chuyển</MenuItem>
            <MenuItem value="delivered">Đã vận chuyển</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
            <MenuItem value="cancelled">Đã hủy</MenuItem>
          </FTextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button type="submit" variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

export default OrderDialog;
