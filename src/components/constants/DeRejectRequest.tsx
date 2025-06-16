"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUpdateRequestStatus } from "@/api-service/request-service";
import { currentUserAtom } from "@/jotai/store";
import { useAtomValue } from "jotai";

export function DeRejectRequest({ request_id, status }) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: updateRequestStatus, isPending: isCreating } =
    useUpdateRequestStatus();
  const currentUser = useAtomValue(currentUserAtom);

  const isAdminProcessing =
    currentUser.role === "admin" && status.toLowerCase() === "rejected";
  const isAgencyRejected =
    currentUser.role === "agency" && status === "rejected";

  const formik = useFormik({
    initialValues: {
      approval_status: currentUser.role === "admin" ? "pending" : "pending",
      status: currentUser.role === "admin" ? "processing" : "sent_to_approval",
      request_id: request_id,
      approved_by: currentUser && currentUser.id,
    },
    onSubmit: async (values, { resetForm }) => {
      updateRequestStatus(values, {
        onSuccess: () => {
          toast.success(
            `Request ${
              currentUser.role === "admin" ? "sent to agency" : "approved"
            } Successfully`
          );
          resetForm();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || "Error creating shift");
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {(isAdminProcessing || isAgencyRejected) && (
        <DialogTrigger asChild>
          <Button variant="outline" className="!bg-green-600">De-Reject</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Approve this request</DialogTitle>
            <DialogDescription>
              Confirm if you want to approve the request and send to agency
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4"></div>

          {isCreating && <Loader2 className="animate-spin" />}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
