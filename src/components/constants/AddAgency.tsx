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
import { currentUserAtom } from "@/jotai/store";
import { useAtomValue } from "jotai";
import { useCreateNewUser } from "@/api-service/user-service";

const generatePlayfulPassword = () => {
  const words = [
    "cat",
    "dog",
    "sun",
    "fun",
    "sky",
    "bug",
    "bee",
    "fox",
    "pop",
    "zap",
  ];
  const number = Math.floor(10 + Math.random() * 90); // generates 2-digit number

  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];

  return `${word1}${number}${word2}`;
};

const password = generatePlayfulPassword();

export function AddAgency() {
  const [open, setOpen] = useState<boolean>(false);
  const currentUser = useAtomValue(currentUserAtom);
  const { mutate: createAgency, isPending: isCreatingAgency } =
    useCreateAgency();
  const { mutate: createUser, isPending: isCreatingUser } = useCreateNewUser();

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
      const userPayload = {
        name: values.agency_name,
        email: `${values.agency_name.replace(
          /\s+/g,
          "-"
        )}@gmail.com`.toLowerCase(),
        password: password,
        role: "agency",
        username: values.agency_name.replace(/\s+/g, "-"),
        department_code: null,
        agency_code: values.agency_name.replace(/\s+/g, "-"),
      };

      createUser(userPayload, {
        onSuccess: (user) => {
          // Assuming 'user' contains the created user object and has an 'id'
          const agencyPayload = {
            agency_name: values.agency_name,
            cost_per_shift: values.cost_per_shift,
            created_by: currentUser && currentUser?.id,
            created_by_role: currentUser && currentUser?.role,
            user_id: user?.id,
          };

          if (user) {
            createAgency(agencyPayload, {
              onSuccess: () => {
                toast.success("Agency Created Successfully");
                resetForm();
                setOpen(false);
              },
              onError: (error) => {
                toast.error(error.message || "Error creating agency");
              },
            });

            toast.success("User Created Successfully");
          }
        },
        onError: (error) => {
          toast.error(error.message || "Error creating user");
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

          {(isCreatingAgency || isCreatingUser) && (
            <div className="flex gap-2 items-center">
              <Loader2 className="animate-spin" />
              <p className="text-sm">
                {isCreatingUser && "Creating Agency Account..."}
                {isCreatingAgency && !isCreatingUser && "Creating Agency..."}
              </p>
            </div>
          )}

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
