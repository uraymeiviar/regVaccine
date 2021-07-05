function selectVacName(element){
    if(element.value == "* Lainnya"){
        document.getElementById("otherVacGroup").style.display = "block";
    }else{
        document.getElementById("otherVacGroup").style.display = "none";
    }
}

function selectGivenVac(element){
    if(element.checked){
        document.getElementById("vacGroup").style.display = "block";
    }else{
        document.getElementById("vacGroup").style.display = "none";
    }
}

function selectInfected(element){
    if(element.checked){
        document.getElementById("infectedGroup").style.display = "block";
    }else{
        document.getElementById("infectedGroup").style.display = "none";
    }
}

function inputName(element){
    if(element.value.trim().length > 0){
        document.getElementById("stateName").innerText = "";
        document.getElementById("stateName").classList.remove("fieldStateError");
        document.getElementById("name").classList.remove("fieldInputError");
        document.getElementById("descName").innerText = "Nama Pastikan sesuai yang tertera di KTP";
    }else{
        document.getElementById("stateName").innerText = "✗"
        document.getElementById("stateName").classList.add("fieldStateError")
        document.getElementById("name").classList.add("fieldInputError");
        document.getElementById("descName").innerText = "Nama tidak boleh kosong";
    }
}

function inputKTP(element){
    if(element.value.length == 16){
        document.getElementById("stateKTP").innerText = "";
        document.getElementById("stateKTP").classList.remove("fieldStateError");
        document.getElementById("ktp").classList.remove("fieldInputError");
        document.getElementById("descKTP").innerText = "Pastikan No.KTP benar, data ini akan digunakan sebagai bukti pendaftaran";
    }else{
        document.getElementById("stateKTP").innerText = "✗"
        document.getElementById("stateKTP").classList.add("fieldStateError")
        document.getElementById("ktp").classList.add("fieldInputError");
        document.getElementById("descKTP").innerText = "Masukkan 16 digit KTP (angka saja)";
    }
}

function inputBirthDate(element){
    var date = new Date(element.value);
    var year = date.getFullYear();
    if(isNaN(year)){
        document.getElementById("stateBirthDate").innerText = "✗"
        document.getElementById("stateBirthDate").classList.add("fieldStateError")
        document.getElementById("birthdate").classList.add("fieldStateError")
        document.getElementById("descBirthDate").innerText = "Masukkan Tanggal Lahir";
    }else{
        document.getElementById("stateBirthDate").innerText = "";
        document.getElementById("stateBirthDate").classList.remove("fieldStateError");
        document.getElementById("birthdate").classList.remove("fieldInputError")
        document.getElementById("descBirthDate").innerText = "";
    }
}

function inputPhone(element){
    if(element.value.length > 5){
        document.getElementById("statePhone").innerText = "";
        document.getElementById("statePhone").classList.remove("fieldStateError");
        document.getElementById("phone").classList.remove("fieldInputError")
        document.getElementById("descPhone").innerText = "No.telp. akan digunakan untuk menginformasikan jadwal sesi vaksin";
    }else{
        document.getElementById("statePhone").innerText = "✗"
        document.getElementById("statePhone").classList.add("fieldStateError")
        document.getElementById("phone").classList.add("fieldInputError")
        document.getElementById("descPhone").innerText = "Masukkan No.telp(hp) angka saja";
    }
}

function inputInfectedEndDate(element){
    var infectedEndDate = new Date(document.getElementById("infectionFinish").value);
    var infectedEndDateYear = infectedEndDate.getFullYear();
    if(isNaN(infectedEndDateYear)){
        document.getElementById("infectionFinish").classList.add("fieldInputError");
    }else{
        document.getElementById("infectionFinish").classList.remove("fieldInputError");
    }
}

function inputVacDate(element){
    var vacDate = new Date(document.getElementById("vacDate").value);
    var vacDateYear = vacDate.getFullYear();
    if(isNaN(vacDateYear)){
        document.getElementById("vacDate").classList.add("fieldInputError");
    }else{
        document.getElementById("vacDate").classList.remove("fieldInputError");
    }
}

function reg(){
    //TODO: input chars validations
    
    var regData = {};
    var nameElement = document.getElementById("name");
    var nameValue = nameElement.value;
    if(nameValue.trim().length == 0){
        document.getElementById("stateName").innerText = "✗"
        document.getElementById("stateName").classList.add("fieldStateError")
        document.getElementById("descName").innerText = "Nama tidak boleh kosong";
        nameElement.classList.add("fieldInputError");
        nameElement.focus();
        return
    }else{
        regData["name"] = nameValue;
    }

    var ktpElement = document.getElementById("ktp");
    var ktpValue = ktpElement.value;
    if(ktpValue.length != 16){
        document.getElementById("stateKTP").innerText = "✗"
        document.getElementById("stateKTP").classList.add("fieldStateError")
        document.getElementById("descKTP").innerText = "Masukkan 16 digit KTP (angka saja)";
        ktpElement.classList.add("fieldInputError");
        ktpElement.focus();
        return
    }else{
        regData["ktp"] = ktpValue;
    }

    regData["alamat"] = document.getElementById("address").value;

    var date = new Date(document.getElementById("birthdate").value);
    var year = date.getFullYear();
    if(isNaN(year)){
        document.getElementById("descBirthDate").innerText = "Masukkan Tanggal Lahir";
        document.getElementById("stateBirthDate").innerText = "✗"
        document.getElementById("stateBirthDate").classList.add("fieldStateError")
        document.getElementById("birthdate").classList.add("fieldInputError")
        document.getElementById("birthdate").focus();
        return
    }else{
        regData["tglLahir"] = date.getDate()+"/"+(date.getMonth()+1)+"/"+year;
    }

    var phoneElement = document.getElementById("phone");
    var phoneValue = phoneElement.value;
    if(phoneValue.length < 6){
        document.getElementById("statePhone").innerText = "✗"
        document.getElementById("statePhone").classList.add("fieldStateError")
        document.getElementById("descPhone").innerText = "MMasukkan No.telp(hp) angka saja";
        phoneElement.classList.add("fieldInputError");
        phoneElement.focus();
        return
    }else{
        regData["phone"] = phoneValue;
    }

    var infectedElement = document.getElementById("infected");
    var infectedValue = infectedElement.value;
    if(infectedValue.checked){
        var infectedStartDate = new Date(document.getElementById("infectionStart").value);
        var infectedEndDate = new Date(document.getElementById("infectionFinish").value);
        var infectedEndDateYear = infectedEndDate.getFullYear();
        if(isNaN(infectedEndDateYear)){
            document.getElementById("infectionFinish").classList.add("fieldInputError");
            document.getElementById("infectionFinish").focus();
            return
        }else{
            regData["infectionEnd"] = infectedEndDate.getDate()+"/"+(infectedEndDate.getMonth()+1)+"/"+infectedEndDateYear;
        }

        var infectedStartDateYear = infectedStartDate.getFullYear();
        if(!isNaN(infectedStartDateYear)){
            regData["infectionStart"] = infectedStartDate.getDate()+"/"+(infectedStartDate.getMonth()+1)+"/"+infectedStartDateYear;
        }
        regData["infected"] = true;
    }else{
        delete regData["infectionStart"];
        delete regData["infectionEnd"];
        regData["infected"] = false;
    }

    var vacElement = document.getElementById("vac");
    var vacValue = vacElement.value;
    if(vacValue.checked){
        var vacDate = new Date(document.getElementById("vacDate").value);
        var vacDateYear = vacDate.getFullYear();
        if(isNaN(vacDateYear)){
            document.getElementById("vacDate").classList.add("fieldInputError");
            document.getElementById("vacDate").focus();
            return
        }else{
            regData["lastVaccinated"] = vacDate.getDate()+"/"+(vacDate.getMonth()+1)+"/"+vacDateYear;
        }
        regData["lastVaccineType"] = document.getElementById("vacName").value
        if(regData["lastVaccineType"] == "* Lainnya"){
            regData["lastVaccineType"] = document.getElementById("otherVacName").value
            if(regData["lastVaccineType"] == ""){
                regData["lastVaccineType"] = "* Tidak Tahu"
            }
        }
        regData["vaccinated"] = true;
    }else{
        delete regData["lastVaccineType"];
        delete regData["lastVaccinated"];
        regData["vaccinated"] = false;
    }

    if(document.getElementById("gender").checked){
        regData["gender"] = "P"
    }else{
        regData["gender"] = "L"
    }

    regData["dataAccount"] = window.location.pathname.substring(1,window.location.pathname.lastIndexOf('/'))
    console.log(regData);
}