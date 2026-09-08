const date = new Date();

const thisYear = date.getFullYear();
let session = [];

for(let i=thisYear; i > thisYear-6; i--){
    session.push(i + "-" + (i+1))
};

const terms = ["First", "Second", "Third"];
export {session, terms};

export const naira = "₦";
export const formatNumber = (num) => {
    const newNum = num.toLocaleString('en-US');
    return newNum;
}