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

export function RejectRequest({ request_id, status }) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: updateRequestStatus, isPending: isCreating } =
    useUpdateRequestStatus();
  const currentUser = useAtomValue(currentUserAtom);

  const isAdminProcessing =
    currentUser.role === "admin" && status.toLowerCase() === "processing";
  const isAgencySentToApproval =
    currentUser.role === "agency" && status === "sent_to_approval";

  const formik = useFormik({
    initialValues: {
      approval_status: currentUser.role === "admin" ? "rejected" : "rejected",
      status: currentUser.role === "admin" ? "rejected" : "rejected",
      request_id: request_id,
      approved_by: currentUser && currentUser.id,
    },
    onSubmit: async (values, { resetForm }) => {
      updateRequestStatus(values, {
        onSuccess: () => {
          toast.success(`Request rejected Successfully`);
          resetForm();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || "Error creating request");
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {(isAdminProcessing || isAgencySentToApproval) && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="!bg-[#ff0000] hover:!bg-[#ff0000]/70"
          >
            Reject
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Reject this request</DialogTitle>
            <DialogDescription>
              Confirm if you want to reject the request.
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
