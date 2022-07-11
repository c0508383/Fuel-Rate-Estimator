//Pricing module class that will be used later
/*
class PricingModule {

}

//EDIT: Empty pricing module moved to routes/PricingModule.js
*/


window.onload = () => {
  const gallonsRequested = document.getElementById('gallonsReq');
  const deliveryAddress = document.getElementById('DelAddress');
  const deliveryCity = document.getElementById('DelCity');
  const deliveryState = document.getElementById('DelState');
  const deliveryZip = document.getElementById('DelZip');
  const deliveryDate = document.getElementById('delDate');
  const pricePerGallon = document.getElementById('price');
  const totalEstimate = document.getElementById('total');

  const calculateButton = document.getElementById("calculateButton");
  const submitGallons = document.getElementById("submitGallons");

  let date = new Date();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let year = date.getFullYear();
  date = year + '-' + month + '-' + day;

  deliveryDate.value = date;

  axios.post('/getInfoObj', {
      ID: sessionStorage.getItem("FQSESSION_userID")
  }).catch( (error) => {
      console.log(error);
  }).then((response) => {
      if(response){
          console.log("User info data found: ");
          console.log(response);

          userInfoObj = response.data;
          console.log(userInfoObj);
          
          if(userInfoObj){
              console.log("Populating field inputs with userInfoObj key values...");
              
              if(userInfoObj.address1 && userInfoObj.address2 && userInfoObj.address1 != ""){
                deliveryAddress.value = userInfoObj.address1 + " " + userInfoObj.address2;
              } else if(userInfoObj.address1 && userInfoObj.address1 != ""){
                deliveryAddress.value = userInfoObj.address1;
              }
              if(userInfoObj.city){
                deliveryCity.value = userInfoObj.city
              }
              if(userInfoObj.state){
                deliveryState.value = userInfoObj.state;
              }
              if(userInfoObj.zipcode){
                deliveryZip.value = userInfoObj.zipcode;
              }
          }
      }
  });

  calculateButton.addEventListener('click', (event) => {
    event.preventDefault();

    var value = gallonsRequested.value;
    if (value === '') {
      alert('You must request an amount of gallons to submit a fuel quote.');
      return;
    }

    var value = totalEstimate.value;
    if (value === '') {
      alert('You must calculate an estimate before submitting a fuel quote.');
      return;
    }

    if (deliveryAddress.value === '' && deliveryCity.value === '' && deliveryState.value === '' && deliveryZip.value === '') {
      alert('Please enter some sort of address by going to the profile edit menu before submitting a fuel quote.');
      return;
    }

    if (deliveryDate.value === '') {
      alert('Please select a date for the delivery to take place.');
      return;
    }

    let submit = {
      ID: sessionStorage.getItem("FQSESSION_userID"),
      gallonsRequested:  gallonsRequested.value,
      deliveryAddress: deliveryAddress.value + ", " + deliveryCity.value + " " + deliveryState.value + " " + deliveryZip.value,
      deliveryDate: deliveryDate.value,
      pricePerGallon: parseFloat(pricePerGallon.value.substring(1)),
      amountDue: parseFloat(totalEstimate.value.substring(1))
    };

    calculateButton.disabled = true;
    submitGallons.disabled = true;
    axios.post('/submitFuelQuote',submit).catch( (error) => {
      console.log(error);
    }).then((response) => {
      calculateButton.disabled = false;
      submitGallons.disabled = false;
      if(response){
        console.log(response);

        alert("Your fuel quote has been submitted!");
        gallonsRequested.value = "";
        deliveryDate.value = date;
        pricePerGallon.value = "";
        totalEstimate.value = "";
      }
    });
  });

  submitGallons.addEventListener('click', (event) => {
    event.preventDefault();

    var value = gallonsRequested.value;

    if (value === '' || parseInt(value) < 1) {
        alert('Please enter an amount of gallons before calculating your quote.');
        return;
    }

    if(deliveryState.value === ''){
      alert("We must know if you're in or out of state to calculate your quote!\nPlease go to profile management to fill out your information.")
      return;
    }

    axios.post('/calcFuelQuote',
      {
        ID: sessionStorage.getItem("FQSESSION_userID"),
        gallonsRequested: value,
        inState: deliveryState.value == "TX",
      }
    ).catch( (error) => {
      console.log(error);
    }).then((response) => {
      if(response){
        console.log(response);
        pricePerGallon.value = "$"+response.data.pricePerGallon;
        totalEstimate.value = "$"+response.data.total;
      }
    });
  });
}