import { useEffect, useState } from "react";
import { ItemHolder } from "./ChiefAdmin/GeneralSetting";
import { mainApi } from "../api";
import axios from "axios";

const initialState = {
  // Backend Generated
  regNo: "",
  admissionNo: "",
  newForm: true,
  // Personal Details
  surname: "",
  firstName: "",
  otherName: "",
  gender: "",
  dob: "",
  religion: "",
  nationality: "Nigeria",
  state: "",
  lga: "",

  // Academic
  class: "",
  arm: "",
  session: "",
  term: "",

  // Contact
  phone: "",
  email: "",
  address: "",

  // Parent
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  occupation: "",

  // Medical
  bloodGroup: "",
  genotype: "",
  disability: "",
  allergies: "",

  // Passport
  passport: null,
};

export default function StudentRegForm() {

  const [setups, setSetups] = useState(null);
  const settingAPI = `${mainApi}/setting`

  useEffect(() => {
    async function getSettings(){
      const settings = await axios.get(settingAPI);
      setSetups(settings.data.settings.setUps);
      console.log(settings.data.settings)
    }

    getSettings()
  }, []);

  if(!setups){
    return <div className="p-4">
      "Registration is not Available at the moment!"
    </div>
  }

  const [student, setStudent] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setStudent((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(student);

    // Later
    // axios.post("/api/students/register", student)
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Heading */}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-indigo-700">
          Student Registration
        </h2>

        <p className="text-gray-500 mt-1">
          Fill all required student information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow border p-6 space-y-8"
      >
        {/* ================= PERSONAL DETAILS ================= */}

        <ItemHolder title="Personal Details">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            <Input
              label="Surname"
              name="surname"
              value={student.surname}
              onChange={handleChange}
            />

            <Input
              label="First Name"
              name="firstName"
              value={student.firstName}
              onChange={handleChange}
            />

            <Input
              label="Other Name"
              name="otherName"
              value={student.otherName}
              onChange={handleChange}
            />

            <Select
              label="Gender"
              name="gender"
              value={student.gender}
              onChange={handleChange}
              options={["Male", "Female"]}
            />

            <Input
              type="date"
              label="Date of Birth"
              name="dob"
              value={student.dob}
              onChange={handleChange}
            />

            <Input
              label="Religion"
              name="religion"
              value={student.religion}
              onChange={handleChange}
            />

            <Input
              label="Nationality"
              name="nationality"
              value={student.nationality}
              onChange={handleChange}
            />

            <Input
              label="State"
              name="state"
              value={student.state}
              onChange={handleChange}
            />

            <Input
              label="L.G.A"
              name="lga"
              value={student.lga}
              onChange={handleChange}
            />
          </div>

        </ItemHolder>

        {/* ================= ACADEMIC ================= */}

        <ItemHolder title="Academic Information">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            <Input
              label="Registration Number"
              name="regNo"
              value={student.regNo}
              disabled
            />

            <Input
              label="Admission Number"
              name="admissionNo"
              value={student.admissionNo}
              disabled
            />

            <Input
              label="Class"
              name="class"
              value={student.class}
              onChange={handleChange}
            />

            <Input
              label="Class Arm"
              name="arm"
              value={student.arm}
              onChange={handleChange}
            />

            <Input
              label="Academic Session"
              name="session"
              value={student.session}
              onChange={handleChange}
            />

            <Select
              label="Term"
              name="term"
              value={student.term}
              onChange={handleChange}
              options={["First", "Second", "Third"]}
            />

          </div>

        </ItemHolder>

        {/* ================= CONTACT ================= */}

        <ItemHolder title="Contact Information">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            <Input
              label="Phone Number"
              name="phone"
              value={student.phone}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              value={student.email}
              onChange={handleChange}
            />

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium mb-2">
                Home Address
              </label>

              <textarea
                name="address"
                rows={3}
                value={student.address}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

        </ItemHolder>

        {/* ================= PARENT ================= */}

        <ItemHolder title="Parent / Guardian">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            <Input
              label="Parent Name"
              name="parentName"
              value={student.parentName}
              onChange={handleChange}
            />

            <Input
              label="Phone"
              name="parentPhone"
              value={student.parentPhone}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="parentEmail"
              value={student.parentEmail}
              onChange={handleChange}
            />

            <Input
              label="Occupation"
              name="occupation"
              value={student.occupation}
              onChange={handleChange}
            />

          </div>

        </ItemHolder>

        {/* ================= MEDICAL ================= */}

        <ItemHolder title="Medical Details">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            <Input
              label="Blood Group"
              name="bloodGroup"
              value={student.bloodGroup}
              onChange={handleChange}
            />

            <Input
              label="Genotype"
              name="genotype"
              value={student.genotype}
              onChange={handleChange}
            />

            <Input
              label="Disability"
              name="disability"
              value={student.disability}
              onChange={handleChange}
            />

            <Input
              label="Allergies"
              name="allergies"
              value={student.allergies}
              onChange={handleChange}
            />

          </div>

        </ItemHolder>

        {/* ================= PASSPORT ================= */}

        <ItemHolder title="Passport Photograph">

          <input
            type="file"
            accept="image/*"
            name="passport"
            onChange={handleChange}
            className="block w-full"
          />

        </ItemHolder>

        {/* BUTTON */}

        <div className="flex justify-end">

          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Register Student
          </button>

        </div>

      </form>
    </div>
  );
}

/* ===================================================== */

function Input({ label, name, value, onChange, type = "text", disabled = false, }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      />
    </div>
  );
}

function Select({label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <select name={name} value={value} onChange={onChange}  className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">Select</option>

        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}