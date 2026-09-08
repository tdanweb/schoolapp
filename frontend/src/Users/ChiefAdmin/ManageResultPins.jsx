import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainApi } from "../../api";
import axios from "axios";

export default function ManageResultPins() {

    const navigate = useNavigate();

    const [savedUser, setSavedUser] = useState({});

    const [pinParams, setPinParams] = useState({
        qts: 20,
        amount: 1000,
        rounds: 3
    });

    const [newPins, setNewPins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");

    const [page, setPage] = useState(1);

    const pinsPerPage = 20;


    // Get logged user
    useEffect(() => {

        const user = JSON.parse(
            localStorage.getItem("logged-user")
        );

        if (!user) {
            navigate("/app/user");
            return;
        }

        setSavedUser(user);

    }, [navigate]);


    // Generate PINs
    async function generatePins() {

        if (!pinParams.qts || pinParams.qts < 1 || pinParams.qts > 100) {
            setAlertMsg("Enter a quantity between 1 and 100.");
            return;
        }

        setLoading(true);
        setAlertMsg("");

        try {

            const res = await axios.post(
                `${mainApi}/staff/result-checker/generate`,
                pinParams
            );

            setAlertMsg(res.data.msg)
            if (res.data.success) {

                setNewPins(res.data.savedPins || []);
                setPage(1);

                setAlertMsg(res.data.msg);

            }

        } catch (error) {

            console.log(error);

            setAlertMsg(
                error?.response?.data?.msg ||
                "Unable to generate result PINs."
            );

        } finally {
            setLoading(false);
        }
    }


    // Pagination
    const totalPages = Math.ceil(
        newPins.length / pinsPerPage
    );

    const startIndex = (page - 1) * pinsPerPage;

    const displayedPins = newPins.slice(
        startIndex,
        startIndex + pinsPerPage
    );


    return (

        <div className="min-h-screen bg-slate-100 p-4 md:p-6">

            {/* HEADER */}
            <div className="mb-6">

                <h4 className="text-xl font-semibold text-slate-800">
                    Create & Manage Result PINs
                </h4>

                <p className="text-sm text-slate-500">
                    Generate, view and print result-checking PINs.
                </p>

                <p className="mt-1 text-sm">
                    USER:{" "}
                    <span className="font-poppins font-semibold">
                        {savedUser?.role || ""}
                    </span>
                </p>

            </div>


            {/* GENERATOR */}
            <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">

                <h5 className="mb-4 font-semibold text-slate-700">
                    Generate New PINs
                </h5>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                    {/* Quantity */}
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">
                            Quantity
                        </label>

                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={pinParams.qts}
                            onChange={(e) =>
                                setPinParams({
                                    ...pinParams,
                                    qts: Number(e.target.value)
                                })
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>


                    {/* Amount */}
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">
                            Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={pinParams.amount}
                            onChange={(e) =>
                                setPinParams({
                                    ...pinParams,
                                    amount: Number(e.target.value)
                                })
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>


                    {/* Rounds */}
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">
                            Allowed Rounds
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={pinParams.rounds}
                            onChange={(e) =>
                                setPinParams({
                                    ...pinParams,
                                    rounds: Number(e.target.value)
                                })
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>


                    {/* Button */}
                    <div className="flex items-end">

                        <button
                            onClick={generatePins}
                            disabled={loading}
                            className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                        >
                            {loading
                                ? "Generating..."
                                : "Generate PINs"
                            }
                        </button>

                    </div>

                </div>


                {alertMsg && (
                    <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                        {alertMsg}
                    </p>
                )}

            </div>


            {/* PIN AREA */}
            {newPins.length > 0 && (

                <div>

                    {/* ACTION BAR */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                        <div>
                            <h5 className="font-semibold text-slate-700">
                                Generated PINs
                            </h5>

                            <p className="text-sm text-slate-500">
                                {newPins.length} PINs generated
                            </p>
                        </div>


                        <button
                            onClick={() => window.print()}
                            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                        >
                            Print Current Page
                        </button>

                    </div>


                    {/* PRINTABLE CARDS */}
                    <div
                        id="result-pin-sheet"
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                    >

                        {displayedPins.map((item) => (

                            <ResultPinCard
                                key={item._id || item.refId}
                                pin={item}
                            />

                        ))}

                    </div>


                    {/* PAGINATION */}
                    {totalPages > 1 && (

                        <div className="mt-6 flex items-center justify-center gap-3">

                            <button
                                disabled={page === 1}
                                onClick={() =>
                                    setPage((p) => p - 1)
                                }
                                className="rounded-lg border bg-white px-4 py-2 text-sm disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-slate-600">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                disabled={page === totalPages}
                                onClick={() =>
                                    setPage((p) => p + 1)
                                }
                                className="rounded-lg border bg-white px-4 py-2 text-sm disabled:opacity-40"
                            >
                                Next
                            </button>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}



/* PIN CARD */
function ResultPinCard({ pin }) {

    return (
        <div className="result-pin-card overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

            {/* SCHOOL HEADER */}
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-700 px-3 py-2 text-white">

                <img
                    src="/crest.png"
                    alt="School crest"
                    className="h-8 w-8 rounded-full object-cover bg-white p-0.5"
                />

                <div className="leading-tight">
                    <p className="text-[10px] font-bold uppercase">
                        Achievers International Schools
                    </p>

                    <p className="text-[8px] text-slate-200">
                        Result Checking PIN
                    </p>
                </div>

            </div>


            {/* PIN */}
            <div className="px-3 py-3 text-center">

                <p className="text-[8px] uppercase tracking-wider text-slate-400">
                    Checking PIN
                </p>

                <p className="mt-0.5 font-mono text-lg font-bold tracking-[0.18em] text-slate-800">
                    {pin.view}
                </p>

            </div>


            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-slate-100 px-3 py-3">

                <PinInfo
                    label="Amount"
                    value={`₦${Number(pin.price || 0).toLocaleString()}`}
                />

                <PinInfo
                    label="Rounds"
                    value={pin.rounds ?? 3}
                />
{/*
                <PinInfo
                    label="Term"
                    value={pin.term || "—"}
                />

                <PinInfo
                    label="Session"
                    value={pin.session || "—"}
                />

                <PinInfo
                    label="Class"
                    value={pin.classId || "—"}
                />

                <PinInfo
                    label="Used"
                    value={pin.useCount ?? 0}
                />
*/}
            </div>


            {/* FOOTER */}
            <div className="border-t border-slate-100 px-3 py-1.5 text-center">

                <p className="text-[8px] leading-tight text-slate-400">
                    Keep this PIN safe. It is required for result checking.
                </p>

            </div>

        </div>
    );
}

function PinInfo({ label, value }) {

    return (
        <div className="min-w-0 flex items-center gap-5">

            {/* LABEL */}
            <p className="text-[7px] font-medium uppercase tracking-wider text-slate-400">
                {label}:
            </p>

            {/* VALUE */}
            <p className="mt-0.5 truncate text-[11px] font-bold text-slate-700">
                {value}
            </p>

        </div>
    );
}

