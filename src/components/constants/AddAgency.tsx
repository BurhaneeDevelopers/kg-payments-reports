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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useCreateAgency } from "@/api-service/agency-services";
import { Loader2 } from "lucide-react";

export function AddAgency() {
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
      createAgency(values, {
        onSuccess: () => {
          toast.success("Shift Created Successfully");
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
      <DialogTrigger asChild>
        <Button variant="outline">Add Agency</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Agency</DialogTitle>
            <DialogDescription>
              Enter agency details and rate per shift.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="agency_name">Agency Name</Label>
              <Input
                id="agency_name"
                name="agency_name"
                value={formik.values.agency_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter agency name"
              />
              {formik.touched.agency_name && formik.errors.agency_name && (
                <span className="text-red-500 text-sm">
                  {formik.errors.agency_name}
                </span>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="cost_per_shift">
                Rate per Person per Shift (8 hours)
              </Label>
              <Input
                id="cost_per_shift"
                name="cost_per_shift"
                type="number"
                value={formik.values.cost_per_shift}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="₹"
              />
              {formik.touched.cost_per_shift &&
                formik.errors.cost_per_shift && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.cost_per_shift}
                  </span>
                )}
            </div>
          </div>

          {isCreating && <Loader2 className="animate-spin" />}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Agency</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
