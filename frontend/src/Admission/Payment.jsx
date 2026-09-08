import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaLock, FaMoneyBill } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { mainApi } from "../api";
import { naira } from "../staticFiles";

function ApplicationFee() {
   const navigate = useNavigate();
  // Dummy data for now
   const [set, setSet] = useState(null)
   const [user, setUser] = useState(null);
   const [pay, setPay] = useState(null);

  const [payment, setPayment] = useState({
    applicationFee: 5000,
    isPaid: false,
    pin: null,
    paidAt: null,
  });

  const [showPayment, setShowPayment] = useState(false);

  const generatePin = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  };

  const handlePayment = async () => {
    const api = `${mainApi}/applicant/pay`
    const pin = generatePin();

    const paying = {
        pin, regNo: user.appId, session: set.session
    };

    console.log("PAID: ", paying)
    try {
        const res = await axios.post(api, paying);
        console.log(res.data)
        alert(res.data.msg)
        localStorage.setItem("applicant-pin", JSON.stringify({pin, createdAt: new Date()}))
    setPayment({
      ...payment,
      isPaid: true,
      pin,
      paidAt: new Date().toLocaleString(),
    });

    setShowPayment(false);
    } catch (error) {
        if(error.response){
            alert(error.response.data.msg)
        } else{
            alert("Network/Server Error...")
        }
    }
  };


  function getSettings(){
    const setting = JSON.parse(localStorage.getItem("admission-setting"))
    setPayment({...payment, applicationFee: setting.applicationFee});
    const app = JSON.parse(localStorage.getItem("logged-applicant"))
    const pinSaved = JSON.parse(localStorage.getItem("applicant-pin"))
     setSet(setting); setUser(app);

     if(pinSaved){
    setPayment({
      applicationFee: setting.applicationFee,
      isPaid: true,
      pin: pinSaved.pin,
      paidAt: pinSaved.createdAt.toLocaleString(),
    });
     }
  }

  useEffect(() => {
    getSettings()
  }, [])


  function toReg ( ) {
    alert("Proceeding to Registration"); navigate("/admission")
  }
  return (
    <div className="min-h-screen bg-slate-50 p-5 flex items-center justify-center">
      <div className="w-full max-w-xl">

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Header */}
          <div className="bg-blue-950 text-white p-6">
            <p className="text-sm text-blue-200 mb-1">
              Admission Portal
            </p>

            <h2 className="text-2xl font-bold">
              Application Fee
            </h2>

       {!payment.isPaid &&
            <p className="text-sm text-blue-100 mt-2">
              Complete your application fee payment to begin registration.
            </p>
       }
          </div>

          <div className="p-6">

            {!payment.isPaid ? (
              <>
                {/* Fee */}
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-5 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                      <FaMoneyBill size={20} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Application Fee
                      </p>
                      <p className="text-sm text-slate-500">
                        One-time payment
                      </p>
                    </div>
                  </div>

                  <p className="text-xl font-bold text-blue-950">
                    ₦{set && set.applicationFee.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3.5 rounded-xl font-semibold transition"
                >
                  Pay Application Fee
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                  <FaLock />
                  Secure payment
                </div>
              </>
            ) : (
              /* Successful Payment */
              <div className="text-center">

                <div className="flex justify-center mb-4">
                  <FaCheckCircle
                    size={55}
                    className="text-green-500"
                  />
                </div>

                <h3 className="text-xl font-bold text-slate-800">
                  Payment Successful
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Your application fee has been received.
                </p>

                {/* PIN */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-6">
                  <p className="text-xs text-blue-600 font-medium mb-2">
                    YOUR APPLICATION PIN
                  </p>

                  <p className="text-2xl font-bold tracking-[4px] text-blue-950">
                    {payment.pin}
                  </p>

                  <p className="text-xs text-slate-500 mt-3">
                    Keep this PIN safe. You will need it to continue your
                    registration.
                  </p>
                </div>

                <button
                  onClick={toReg}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-950 py-3.5 rounded-xl font-bold mt-6 transition"
                >
                  Proceed to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Overlay */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5 z-50">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Make Payment
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Application Fee
                  </p>
                </div>

                <button
                  onClick={() => setShowPayment(false)}
                  className="text-slate-400 hover:text-slate-700 text-xl"
                >
                  ×
                </button>
              </div>

              {/* Payment amount */}
              <div className="bg-slate-50 rounded-xl p-5 mb-6 text-center">
                <p className="text-sm text-slate-500">
                  Amount to pay
                </p>

                <p className="text-3xl font-bold text-blue-950 mt-1">
                  ₦{set.applicationFee.toLocaleString()}
                </p>
              </div>

              {/* Dummy payment method */}
              <div className="border border-slate-200 rounded-xl p-4 mb-5">
                <p className="text-sm font-semibold text-slate-700">
                  Payment Method
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Card / Bank Transfer
                </p>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3.5 rounded-xl font-semibold"
              >
                Confirm & Pay ₦
                {set.applicationFee.toLocaleString()}
              </button>

              <p className="text-xs text-center text-slate-400 mt-4">
                This is currently a demo payment interface.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationFee;