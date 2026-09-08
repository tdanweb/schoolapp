//only editables...

function SetStaffRoles({staff}){

    const [duties, setDuties] = useState(staff.specialRoles);
    const [category, setCategory] = useState(staff.staffCategory); //teaching, non-teaching..
    const [type, setType] = useState(staff.staffType); //admin2, admin or regular

    return <div className="flex flex-col gap-5 p-4">
        <h4 className="font-bold text-teal=900 font-poppins">
            SET ROLES AND PERMISSIONS
        </h4>
    </div>
}