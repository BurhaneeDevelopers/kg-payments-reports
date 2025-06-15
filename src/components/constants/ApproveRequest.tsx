"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
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
import { useCreateAgency } from "@/api-service/agency-services";
import { Loader2 } from "lucide-react";

export function CreateRequest() {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: createAgency, isPending: isCreating } = useCreateAgency();

  const formik = useFormik({
    initialValues: {
      agency_name: "",
      cost_per_shift: "",
    },
    validationSchema: Yup.object({
      agency_name: Yup.string().required("Agency name is required"),
      cost_per_shift: Yup.number()
        .typeError("Must be a number")
        .positive("Rate must be positive")
        .required("Rate is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Approve</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Approve this request</DialogTitle>
            <DialogDescription>
              Confirm if you want to approve the request and send to agency
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">

          </div>

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
