
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyB0EVnT2YVDp3lbiHG39Jdkig_trx0uP8A",
    authDomain: "webd-31c11.firebaseapp.com",
    projectId: "webd-31c11",
    storageBucket: "webd-31c11.appspot.com",
    messagingSenderId: "994811042267",
    appId: "1:994811042267:web:8ebc1ee35d5a76e5252ffe",
    measurementId: "G-SKRKB46P59"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const wrapper = document.querySelector('.wrapper');
const loginLink= document.querySelector('.login-link');
const registerLink= document.querySelector('.register-link');
registerLink?.addEventListener('click',()=>{
    wrapper.classList.add('active');
});
loginLink?.addEventListener('click',()=>{
    wrapper.classList.remove('active');
});

const medicineNames = ['Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin', 'Penicillin', 'Niacinamide', 'BHA', 'Ethinylestradiol','Glycerine'];
const username = document.getElementById("username");
const password = document.getElementById("password");
const lusername = document.getElementById("lusername");
const lpassword = document.getElementById("lpassword");
const registerButton = document.getElementById("Register");
const loginButton = document.getElementById("Login");
const myinfo = document.getElementById("myinfo");
const myname = document.getElementById("name");
const mydateofbth = document.getElementById("dateofbth");
const myaddress = document.getElementById("address");
const mygender = document.getElementById("gender");
const myoccupation = document.getElementById("occupation");
const mynumber = document.getElementById("pnumber");
const mySpecialty = document.getElementById("specialty");
const myExperience = document.getElementById("experience");
const myPatient = document.getElementById("Patients");
const TestResultbtn = document.getElementById("TestResultbtn");
const searchbtn = document.getElementById("Search");
const medSavebtn = document.getElementById("medsave");
const medBuybtn = document.getElementById("medbuy");

registerButton?.addEventListener("click", async (e) => {
    e.preventDefault(); 
    const newUser = new User(
        username.value,
    );

    const userDocRef = doc(db, 'accounts', newUser.username);
    await setDoc(userDocRef, {
        username: username.value,
        password: password.value
    });
    alert("Registration successful!");
});

loginButton?.addEventListener("click", async (e) => {
    e.preventDefault(); 
    const userDocRef = doc(db, 'accounts', lusername.value);
    const userDoc = await getDoc(userDocRef); 
    if (userDoc.exists()) {
        const userData = userDoc.data();
        const storedPassword = userData.password;
        const storedUsername = userData.username;
        if (lusername.value === storedUsername && lpassword.value === storedPassword) {

            if(lusername.value ==="doc1"||lusername.value==="doc2"){
                localStorage['lusername'] = lusername.value;
                window.location.href = "patient.html"; 
            }
            else if(lusername.value=== "med"){
                window.location.href = "medicin.html"; 
            }
            else{
            localStorage['lusername'] = lusername.value;
            window.location.href = "doc.html"; 
            }
        } else {
            alert("Incorrect username or password.");
        }        
    } else {
        alert("Account not found.");
    }
});
TestResultbtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const patientName = document.getElementById('patientname')?.value; 
    const testResult = document.getElementById('Result')?.value; 
    const advice = document.getElementById('Advice')?.value;

    if (patientName && testResult && advice) {
        const userDocRef = doc(db, 'accounts', patientName);
        // Kiểm tra nếu tài liệu Firestore tồn tại
        try {
            const patientDoc = await getDoc(userDocRef);
            if (patientDoc.exists()) {
                const patient = Patient.fromFirestore(patientDoc);
                patient.addTestResult(testResult);
                patient.addAdvice(advice);
                await patient.updateFirestore(db); 
                alert("Test result and advice added successfully.");
            } else {
                alert("Patient not found."); 
            }
        } catch (error) {
            alert("Error updating Firestore:", error);
        }
    } else {
        alert("Missing required information."); 
    }    
});

myinfo?.addEventListener("click", async (e) => {
    e.preventDefault(); 
    const lusername = localStorage['lusername'];
    if (lusername === "doc1") {
        const updatedDoc = new Doctor(
            lusername, 
            myname.value,   
            mydateofbth.value,  
            myaddress.value,  
            mygender.value,   
            myoccupation.value,  
            mynumber.value,
            mySpecialty.value,
            myExperience.value
        );
        if (myPatient.value) {
            updatedDoc.addPatient(myPatient.value);
        }

        await updatedDoc.updateFirestore(db);
        alert("Doctor information updated!");
    } else {
        const updatedUser = new Patient(
            lusername, 
            myname.value,   
            mydateofbth.value,  
            myaddress.value,  
            mygender.value,   
            myoccupation.value,  
            mynumber.value
        );
        
        await updatedUser.updateFirestore(db);
        alert("Patient information updated!");
    }
});

const changeBackgroundAndUpdateSchedule = async (elementId, treatmentValue) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener('click', async (e) => {
            e.preventDefault();
            element.style.backgroundColor = 'blue'; 
            const userRef = doc(db, 'accounts', localStorage['lusername']); 
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const patient = Patient.fromFirestore(userDoc);
                patient.addTreatmentSchedule(treatmentValue);
                await patient.updateFirestore(db);
                console.log("Treatment schedule updated successfully.");
            } else {
                console.error("Patient not found."); 
            }
        });
    }
};
for (let i = 1; i <= 35; i++) {
    changeBackgroundAndUpdateSchedule(`${i}`, `${i}`);
}
const changeBackground = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.backgroundColor = 'blue';
    } 
};
searchbtn?.addEventListener("click", async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của sự kiện

    const patientId = document.getElementById('scheduleid')?.value; // Đảm bảo lấy giá trị từ input
    if (!patientId) {
        console.error("Patient ID is required."); // Nếu không có ID, báo lỗi
        return;
    }

    try {
        const userRef = doc(db, 'accounts', patientId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const patient = Patient.fromFirestore(userDoc);

            if (Array.isArray(patient.treatmentSchedule)) {
                patient.treatmentSchedule.forEach((scheduleId) => {
                    changeBackground(scheduleId); // Đổi màu nền theo `treatmentSchedule`
                });
            } else {
                console.error("Treatment schedule is not an array."); 
            }

        } else {
            console.error("User document not found.");
        }
    } catch (error) {
        console.error("Error while retrieving patient information:", error);
    }
});
medSavebtn?.addEventListener("click", async (e) => {
    e.preventDefault(); 
    
    const medName = document.getElementById("medName")?.value;
    const quantity = document.getElementById("Quantity")?.value;
    const xs = document.getElementById("sx")?.value;
    const ex = document.getElementById("ex")?.value;

    if (!medName) { // Kiểm tra tên thuốc trước khi tiếp tục
        alert("Medicine name is required.");
        return;
    }
    const newMed = new Med(quantity, xs, ex);
    const userDocRef = doc(db, 'medicine', medName); 

    await setDoc(userDocRef, newMed.toFirestore());
    alert("Medicine registered successfully!");
});
medBuybtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    const medName = document.getElementById("medNamee")?.value;
    const quantityToBuy = parseInt(document.getElementById("Quantitye")?.value, 10); // Đảm bảo là số nguyên

    if (!medName) { // Kiểm tra tên thuốc trước khi tiếp tục
        alert("Medicine name is requiredddd.");
        return;
    }

    if (isNaN(quantityToBuy) || quantityToBuy <= 0) {
        alert("Quantity must be a positive number.");
        return;
    }

    const userDocRef = doc(db, 'medicine', medName); // Lấy tài liệu từ Firestore

    try {
        const medDoc = await getDoc(userDocRef); // Lấy tài liệu
        if (medDoc.exists()) {
            const med = Med.fromFirestore(medDoc); // Tạo đối tượng `Med`
            const currentQuantity = parseInt(med.quantity, 10); // Lấy số lượng hiện tại

            if (currentQuantity >= quantityToBuy) { // Đảm bảo số lượng hiện tại đủ
                const newQuantity = currentQuantity - quantityToBuy; // Tính toán số lượng mới
                med.quantity = newQuantity; // Cập nhật số lượng trong đối tượng `Med`

                await updateDoc(userDocRef, { quantity: newQuantity }); // Cập nhật Firestore
                alert(`Successfully purchased ${quantityToBuy} units of ${medName}.`);
                window.location.reload(); 
            } else {
                alert(`Insufficient quantity. Only ${currentQuantity} units available.`);
            }
        } else {
            alert(`Medicine '${medName}' not found.`);
        }
    } catch (error) {
        console.error("Error updating Firestore:", error); // Xử lý lỗi
    }
});


window?.addEventListener("load", async (e) => {
    for (let i = 0; i < medicineNames.length; i++) {
        const medName = medicineNames[i]; // Lấy tên thuốc theo số thứ tự
        const userDocRef = doc(db, 'medicine', medName); // Sử dụng `medName` để tạo ID tài liệu
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const med = Med.fromFirestore(userDoc); // Tạo đối tượng `Med` từ Firestore

            // Cập nhật giá trị cho các trường đầu vào
            document.getElementById(`medName${i + 1}`)?.setAttribute('placeholder', medName); // Đảm bảo ID hợp lệ
            document.getElementById(`Quantity${i + 1}`)?.setAttribute('placeholder', med.quantity);
            document.getElementById(`sx${i + 1}`)?.setAttribute('value', med.xs);
            document.getElementById(`ex${i + 1}`)?.setAttribute('value', med.ex);
        } else {
            console.error(`Medicine '${medName}' not found.`);
        }
    }
});

window?.addEventListener("DOMContentLoaded", async (e) => {
    const userRef = doc(db, 'accounts', localStorage['lusername']);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        const patient = Patient.fromFirestore(userDoc);
        if (Array.isArray(patient.treatmentSchedule)) {
            patient.treatmentSchedule.forEach((scheduleId) => {
                changeBackground(`${scheduleId}`);
            });
        } else {
            console.error("Treatment schedule is not an array."); 
        }

    } else {
        console.error("User document not found.");
    }
});
window?.addEventListener("DOMContentLoaded", async (e) => {
    const userDocRef = doc(db, 'accounts', localStorage['lusername']);
    const userDoc = await getDoc(userDocRef);
    const doctor = Doctor.fromFirestore(userDoc);
    const patient = Patient.fromFirestore(userDoc);
    if(localStorage['lusername']==="doc1"){
        if (userDoc.exists()) { 
            document.getElementById('name')?.setAttribute('placeholder', doctor.fullname);
            document.getElementById('dateofbth')?.setAttribute('value', doctor.dayOfBirth);
            document.getElementById('address')?.setAttribute('placeholder', doctor.address);
            document.getElementById('gender')?.setAttribute('placeholder', doctor.gender);
            document.getElementById('occupation')?.setAttribute('placeholder', doctor.occupation);
            document.getElementById('specialty')?.setAttribute('placeholder', doctor.specialty);
            document.getElementById('experience')?.setAttribute('placeholder', doctor.yearsOfExperience);
        } else {
            console.log("User data not found.");
        }
    }
    if (userDoc.exists()) {
        document.getElementById('name')?.setAttribute('placeholder', patient.fullname);
        document.getElementById('dateofbth')?.setAttribute('value', patient.dayOfBirth);
        document.getElementById('address')?.setAttribute('placeholder', patient.address);
        document.getElementById('gender')?.setAttribute('placeholder', patient.gender);
        document.getElementById('occupation')?.setAttribute('placeholder', patient.occupation);
        document.getElementById('pnumber')?.setAttribute('placeholder', patient.phoneNumber);
    } else {
        console.log("User data not found.");
    }
}); 
window?.addEventListener("DOMContentLoaded", async (e) => {
        const userDocRef = doc(db, 'accounts', localStorage['lusername']);
        const userDoc = await getDoc(userDocRef);
        const doctor = Doctor.fromFirestore(userDoc);
        const docInfo1 = document.getElementById('docInfo1');
        const docInfo2 = document.getElementById('docInfo2');
        const docInfo3 = document.getElementById('docInfo3');
        const docInfo4 = document.getElementById('docInfo4');
        const docInfo5 = document.getElementById('docInfo5');
        const patientsList = doctor.listPatients();

        if (docInfo1 && docInfo2 && docInfo3 && docInfo4 && docInfo5) {
            docInfo1.innerHTML = "Name: " + doctor.fullname;
            docInfo2.innerHTML = "Gender: " + doctor.gender;
            docInfo3.innerHTML = "Occupation: " + doctor.occupation;
            docInfo4.innerHTML = "Phone Number: " + doctor.phoneNumber;
            docInfo5.innerHTML = patientsList.replace(/\n/g, "<br>");
        } 
});
window?.addEventListener("DOMContentLoaded", async (e) => { 
    const userPatientRef = doc(db, 'accounts', localStorage['lusername']);
    const userPatient = await getDoc(userPatientRef);

    if (userPatient.exists()) {
        const patient = Patient.fromFirestore(userPatient);

        const patientResult = document.getElementById('patientResult');
        const patientAdvice = document.getElementById('patientAdvice');

        if (patientResult && patientAdvice) {
            patientResult.innerHTML = patient.testResults || "No test results";
            patientAdvice.innerHTML = patient.advice || "No advice";
        } 
    }
});

class User {
    constructor(username, fullname, dayOfBirth, address, gender, occupation, phoneNumber) {
        this.username = username;
        this.fullname = fullname;
        this.dayOfBirth = dayOfBirth;
        this.address = address;
        this.gender = gender;
        this.occupation = occupation;
        this.phoneNumber = phoneNumber;
    }
    toFirestore() {
        return {
            username: this.username,
            Fullname: this.fullname,
            DayofBirth: this.dayOfBirth,
            Address: this.address,
            Gender: this.gender,
            Occupation: this.occupation,
            Phonenumber: this.phoneNumber
        };
    }
    async updateFirestore(db) {
        const userDocRef = doc(db, 'accounts', this.username);
        await updateDoc(userDocRef, this.toFirestore());
    }
    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new User(
            data.username,
            data.Fullname,
            data.DayofBirth,
            data.Address,
            data.Gender,
            data.Occupation,
            data.Phonenumber
        );
    }
}
class Doctor extends User {
    constructor(username, fullname, dayOfBirth, address, gender, occupation, phoneNumber, specialty, yearsOfExperience, treatmentSchedule = [], patients = []) {
        super(username, fullname, dayOfBirth, address, gender, occupation, phoneNumber);
        this.specialty = specialty;
        this.yearsOfExperience = yearsOfExperience;
        this.treatmentSchedule = treatmentSchedule;
        this.patients = patients;
    }
    
    addPatient(patient) {
        this.patients.push(patient);
    }
    
    updateFirestore(db) {
        super.updateFirestore(db);
    }

    listPatients() {
        if (!Array.isArray(this.patients) || this.patients.length === 0) {
            return "No patients found.";
        }
    
        let patientList = "Danh sách bệnh nhân:\n";
        this.patients.forEach((patient, index) => {
            patientList += `${index + 1}. ${patient || "Unnamed patient"}\n`;
        });
    
        return patientList;
    }
    
    
    toFirestore() {
        const baseData = super.toFirestore();
        return {
            ...baseData,
            Specialty: this.specialty,
            YearsOfExperience: this.yearsOfExperience,
            Patients: this.patients
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Doctor(
            data.username,
            data.Fullname,
            data.DayofBirth,
            data.Address,
            data.Gender,
            data.Occupation,
            data.Phonenumber,
            data.Specialty,
            data.YearsOfExperience,
            data.TreatmentSchedule || [],
            data.Patients || [] 
        );
    }
    
}
class Patient extends User {
    constructor(username, fullname, dayOfBirth, address, gender, occupation, phoneNumber, advice = [], testResults = [], treatmentSchedule = []) {
        super(username, fullname, dayOfBirth, address, gender, occupation, phoneNumber);
        this.advice = advice; 
        this.testResults = testResults;
        this.treatmentSchedule = treatmentSchedule; 
    }
    
    addAdvice(newAdvice) {
        this.advice.push(newAdvice);
    }

    addTestResult(result) {
        this.testResults.push(result);
    }
    addTreatmentSchedule(treatmentSchedule) {
        this.treatmentSchedule.push(treatmentSchedule);
    }
    toFirestore() {
        const baseData = super.toFirestore();
        return {
            ...baseData,
            Advice: this.advice,
            TestResults: this.testResults,
            TreatmentSchedule: this.treatmentSchedule,
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Patient(
            data.username,
            data.Fullname,
            data.DayofBirth,
            data.Address,
            data.Gender,
            data.Occupation,
            data.Phonenumber,
            data.Advice || [], // Đảm bảo không undefined
            data.TestResults || [],
            data.TreatmentSchedule || []
        );
    }
}

class Med {
    constructor(quantity, xs, ex) {     // Tên thuốc
        this.quantity = quantity; 
        this.xs = xs;          
        this.ex = ex;
    }

    toFirestore() {
        return {
            quantity: this.quantity,
            xs: this.xs,
            ex: this.ex
        };
    }
    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Med(
            data.quantity,
            data.xs,
            data.ex
        );
    }
}