"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Optional, for notifications
import { useGetAllAgencies } from "@/api-service/agency-services";
import { Loader2 } from "lucide-react";
import moment from "moment";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useCreateMultipleShifts } from "@/api-service/shift-services";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "@/jotai/store";
import { useRouter } from "next/navigation";

const LABOURTYPE = [
  "Bouncers",
  "Cleaners",
  "Cooks",
  "Utensils Washing",
  "Helpers",
  "Supervisors",
  "Garbage Collectors",
  "House Cleaning",
  "Security Guard",
  "Event Manager",
  "Traffic Marshal",
];

const ZONES = [
  "Burhani Zone (Burhani Masjid)",
  "CMZ",
  "Ezzi Zone (Aadukallam)",
  "Fakhri Zone (Kilpauk)",
  "Hakimi Zone (YMCA)",
  "Imadi Zone (Binny)",
  "Mohammadi Zone (Mohammadi Masjid)",
  "Najmi Zone (Dawoodi Markaz)",
  "Taheri Zone (Burhani Markaz)",
  "Vajihi Zone (Vajihi Masjid)",
];

const DEPARTMENTS = [
  "Accommodation",
  "AVR / Photography",
  "Central Office",
  "Communications",
  "Construction",
  "Finance",
  "Fire Safety & Security",
  "Flow Management",
  "Follow Up",
  "Food Safety and Hygiene",
  "HR",
  "IT / Technology Services And Support",
  "ITS",
  "Karamat",
  "Mawaid",
  "Mumineen Mehmaan Reception",
  "Nazafat",
  "Ohbat & Waaz Tallaqi",
  "PMO",
  "Procurement",
  "Public Relations",
  "Qasre Aali Management",
  "Security",
  "Sehat, Medical",
  "Tazyeen",
  "Transport",
  "Zones",
];

export function AddShift() {
  const [open, setOpen] = useState<boolean>(false);
  const { data: agencies = [] } = useGetAllAgencies();
  const { mutate: createShift, isPending: isCreating } =
    useCreateMultipleShifts();
  const currentUser = useAtomValue(currentUserAtom);
  const router= useRouter()

  const formik = useFormik({
    initialValues: {
      zone: "",
      department: "",
      shift_type: [] as { id: string; staff_attended: number }[],
      shift_date: moment().format("dd-mm-yyyy"),
      function: "",
      agency_id: "",
      agency_name: "",
      created_by: currentUser && currentUser.id,
    },
    validationSchema: Yup.object({
      zone: Yup.string().required("Zone is required"),
      department: Yup.string().required("Department is required"),
      // staff_attended: Yup.number().required("Staff count required").min(1),
      shift_type: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().required(),
          staff_attended: Yup.number()
            .transform((value, originalValue) =>
              String(originalValue).trim() === "" ? undefined : value
            )
            .nullable()
            .min(0, "Cannot be negative"),
        })
      ),
      agency_id: Yup.string().required("Agency is required"), // NEW
    }),
    onSubmit: (values) => {
      createShift(
        {
          shifts: values.shift_type,
          shift_date: values.shift_date,
          zone: values.zone,
          department: values.department,
          function: values.function,
          agency_id: values.agency_id,
          agency_name: values.agency_name,
          created_by: values.created_by,
        },
        {
          onSuccess: () => {
            toast.success("Shifts Created Successfully");
            setOpen(false);
            router.push("/active-requests")
          },
          onError: (error) => {
            toast.error(getErrorMessage(error) || "Error creating shifts");
          },
        }
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Shift</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[500px] overflow-y-auto">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Shift</DialogTitle>
            <DialogDescription>
              Fill in the details to mark the shift attendance.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Zone */}
            <div className="grid gap-2">
              <Label>Zone</Label>
              <Select
                value={formik.values.zone}
                onValueChange={(val) => formik.setFieldValue("zone", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  {ZONES.map((zone, idx) => (
                    <SelectItem key={idx} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.zone && formik.errors.zone && (
                <span className="text-red-500 text-sm">
                  {formik.errors.zone}
                </span>
              )}
            </div>

            {/* Department */}
            <div className="grid gap-2">
              <Label>Department</Label>
              <Select
                value={formik.values.department}
                onValueChange={(val) => formik.setFieldValue("department", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dep, idx) => (
                    <SelectItem key={idx} value={dep}>
                      {dep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.department && formik.errors.department && (
                <span className="text-red-500 text-sm">
                  {formik.errors.department}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Agency</Label>
              <Select
                value={formik.values.agency_id}
                onValueChange={(val) => {
                  const selectedAgency = agencies.find((a) => a.id === val);

                  formik.setFieldValue("agency_id", val);
                  formik.setFieldValue(
                    "agency_name",
                    selectedAgency?.agency_name || ""
                  );
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Agency" />
                </SelectTrigger>
                <SelectContent>
                  {agencies.length !== 0 ? (
                    agencies.map((agency) => (
                      <SelectItem key={agency.id} value={agency.id}>
                        {agency.agency_name}
                      </SelectItem>
                    ))
                  ) : (
                    <p className="text-sm p-2">No Agency Available</p>
                  )}
                  <SelectItem value="un_organized">
                    Un Organized | others
                  </SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.agency_id && formik.errors.agency_id && (
                <span className="text-red-500 text-sm">
                  {formik.errors.agency_id}
                </span>
              )}
            </div>

            {/* Shift Date */}
            <div className="grid gap-2">
              <Label>Shift Date</Label>
              <Input
                name="shift_date"
                type="date"
                value={formik.values.shift_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter date of the shift"
              />
              {formik.touched.shift_date && formik.errors.shift_date && (
                <span className="text-red-500 text-sm">
                  {formik.errors.shift_date}
                </span>
              )}
            </div>

            {/* Function Name */}
            <div className="grid gap-2">
              <Label>Specefic role/function</Label>
              <Select
                value={formik.values.function}
                onValueChange={(val) => formik.setFieldValue("function", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Function" />
                </SelectTrigger>
                <SelectContent>
                  {LABOURTYPE.map((dep, idx) => (
                    <SelectItem key={idx} value={dep}>
                      {dep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.function && formik.errors.function && (
                <span className="text-red-500 text-sm">
                  {formik.errors.function}
                </span>
              )}
            </div>

            {/* Staff Count */}
            {/* <div className="grid gap-2">
              <Label>Number of Staff Attended</Label>
              <Input
                type="number"
                name="staff_attended"
                value={formik.values.staff_attended}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 12"
              />
              {formik.touched.staff_attended &&
                formik.errors.staff_attended && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.staff_attended}
                  </span>
                )}
            </div> */}

            {/* Shift Type */}
            <div className="grid gap-2">
              <Label className="text-base">Shift Type</Label>
              <div className="space-y-2">
                {[
                  { id: "1", label: "Shift 1 | 6:00AM-2:00PM" },
                  { id: "2", label: "Shift 2 | 2:00PM-10:00PM" },
                  { id: "3", label: "Shift 3 | 10:00PM-6:00AM" },
                ].map((shift) => {
                  const selectedShift = formik.values.shift_type.find(
                    (s) => s.id === shift.id
                  );

                  return (
                    <div
                      key={shift.id}
                      className="flex flex-col gap-1 flex-grow py-2"
                    >
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!!selectedShift}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              formik.setFieldValue("shift_type", [
                                ...formik.values.shift_type,
                                { id: shift.id, staff_attended: 1 },
                              ]);
                            } else {
                              formik.setFieldValue(
                                "shift_type",
                                formik.values.shift_type.filter(
                                  (s) => s.id !== shift.id
                                )
                              );
                            }
                          }}
                        />
                        <span>{shift.label}</span>
                      </label>

                      <div className="pl-6">
                        {selectedShift && (
                          <Input
                            type="number"
                            className="flex-grow"
                            placeholder="Staff count"
                            value={selectedShift.staff_attended}
                            onChange={(e) => {
                              const value = e.target.value;
                              const updated = formik.values.shift_type.map(
                                (s) =>
                                  s.id === shift.id
                                    ? {
                                        ...s,
                                        staff_attended:
                                          value === "" ? "" : Number(value),
                                      }
                                    : s
                              );
                              formik.setFieldValue("shift_type", updated);
                            }}
                            min={1}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {formik.touched.shift_type &&
                typeof formik.errors.shift_type === "string" && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.shift_type}
                  </span>
                )}
              <p className="text-xs">
                NOTE: Each shift allows custom staff count based on attendance.
              </p>
            </div>

            {/* Total Cost Display */}
            {/* {totalCost > 0 && (
              <div className="text-green-600 font-semibold">
                Total Cost: ₹{totalCost}
              </div>
            )} */}
          </div>
          {isCreating && <Loader2 className="animate-spin" />}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Shift</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
