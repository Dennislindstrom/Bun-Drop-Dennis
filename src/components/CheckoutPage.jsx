import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CheckoutPage({ order, setOrder }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneNumberInput, setShowPhoneNumberInput] = useState(false);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [inputError, setInputError] = useState(false);
  const [owner, setOwner] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCVV] = useState('');
  const [expirationDate, setExpirationDate] = useState({month: '', year: ''});
  const [showCreditCardInput, setShowCreditCardInput] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isButtonDisabledSwish, setIsButtonDisabledSwish] = useState(true);
  
  
  
  useEffect(() => {
    const isDisabled =
      name.trim() === '' ||
      lastName.trim() === '' ||
      city.trim() === '' ||
      address.trim() === '' ||
      owner.trim() === '' ||
      owner.length < 2 ||
      owner.length > 21 ||
      cardNumber.trim() === '' ||
      cardNumber.length !== 16 ||
      cvv.trim() === '' ||
      cvv.length !== 3 ||
      expirationDate.month.trim() === '' ||
      expirationDate.month.length !== 2 ||
      expirationDate.year.trim() === '' ||
      expirationDate.year.length !== 2;
  
    setIsButtonDisabled(isDisabled);
  }, [name, lastName, city, address, owner, cardNumber, cvv, expirationDate]);

  useEffect(() => {
    const isDisabled =
      phoneNumber.trim() === '' ||
      phoneNumber.length !== 10 ||
      name.trim() === '' ||
      lastName.trim() === '' ||
      city.trim() === '' ||
      address.trim() === '';
  
    setIsButtonDisabledSwish(isDisabled);
  }, [phoneNumber, name, lastName, city, address]);

  useEffect(() => {
    const isDisabled =
      phoneNumber.trim() === '' ||
      phoneNumber.length !== 10 ||
      name.trim() === '' ||
      lastName.trim() === '' ||
      city.trim() === '' ||
      address.trim() === '';
  
    setIsButtonDisabledSwish(isDisabled);
  }, [phoneNumber, name, lastName, city, address]);
  


  const checkSwishChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const checkOwnerChange = (event) => {
    setOwner(event.target.value);
  };

  
  const checkcardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  
  const checkCVVchange = (event) => {
    setCVV(event.target.value);
  };

  const checkExpirationMonthchange = (event) => {
    setExpirationDate((prevState) => ({
      ...prevState,
      month: event.target.value
    }));
  };

  
  const checkExparationYearChange = (event) => {
    setExpirationDate((prevState) => ({
      ...prevState,
      year: event.target.value
    }));
  };







  const checkInputBeforeSwish = () => {
    if (
      name.trim() === '' ||
      lastName.trim() === '' ||
      city.trim() === '' ||
      address.trim() === ''
    ) {
      setInputError(true);
    } else {
      setInputError(false);
      if (totalPrice > 0) {
        setShowPhoneNumberInput(true);
        setShowCreditCardInput(false);
      } else {
        
        
      }
    }
  };

  const checkInputforCard = () => {
    if (
      name.trim() === '' ||
      lastName.trim() === '' ||
      city.trim() === '' ||
      address.trim() === ''
    ) {
      setInputError(true);
    } else {
      setInputError(false);
      if (totalPrice > 0) {
        setShowPhoneNumberInput(false);
        setShowCreditCardInput(true);
      } else {
        
      }
    }
  };
  
  const isCartEmpty = Object.keys(order).length === 0;

  const CardPayButton = () => {
    if (
      name.trim() === '' ||
      lastName.trim() === '' ||
      city.trim() === '' ||
      address.trim() === '' ||
      owner.trim() === '' ||
      owner.length < 2 ||
      owner.length > 21 ||
      cardNumber.trim() === '' ||
      cardNumber.length !== 16 ||
      cvv.trim() === '' ||
      cvv.length !== 3 || 
      expirationDate.month.trim() === '' ||
      expirationDate.month.length !== 2 ||
      expirationDate.year.trim() === '' ||
      expirationDate.year.length !== 2
    ) {
      setInputError(true);
      setIsButtonDisabled(true); 
    } else {
      setInputError(false);
      setIsButtonDisabled(false); 
  
      setOrder({});
      localStorage.removeItem('order'); 
    }
  };
  
  
  
  
  

  const swishPayButton = () => {
    if (
      phoneNumber.trim() === '' ||
      phoneNumber.length !== 10 ||
      name.trim() === '' ||
      lastName.trim() === '' ||
      city.trim() === '' ||
      address.trim() === ''
    ) {
      setInputError(true);
    } else {
      setInputError(false);
      setOrder({});
      localStorage.removeItem('order'); 
    }
  };

  const burgerItems = Object.values(order).map((item) => {
    const { burger, quantity } = item;
    if (burger) {
      return (
        <div key={burger.id}>
          <span>
            {quantity}x {burger.title}
          </span>
        </div>
      );
    }
    return null;
  });

  const sodaItems = Object.values(order).map((item) => {
    const { soda, quantity } = item;
    if (soda) {
      return (
        <div key={soda.id}>
          <span>
            {quantity}x {soda.title}
          </span>
        </div>
      );
    }
    return null;
  });

  const friesItems = Object.values(order).map((item) => {
    const { fries, quantity } = item;
    if (fries) {
      return (
        <div key={fries.id}>
          <span>
            {quantity}x {fries.title}
          </span>
        </div>
      );
    }
    return null;
  });

  let totalPrice = 0;

  
  Object.values(order).forEach((item) => {
    const { totalPrice: itemTotalPrice } = item;
    totalPrice += itemTotalPrice;
  });

  return (
  
    <div>
      <h1>Checkout</h1>
      {inputError && (
      <p className="error-checkout-message">Please fill all fields correctly.</p>
      
      
      
    )}
      <div className="input-container">
        <input
          type="text"
          id="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First Name"
        />
      </div>
      <div className="input-container">
        <input
          type="text"
          id="last-name-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
      </div>
      <div className="input-container">
        <input
          type="text"
          id="city-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
      </div>
      <div className="input-container">
        <input
          type="text"
          id="address-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
      </div>
      <p className="price-display">Total Price: {totalPrice} kr</p>
      <hr />
      <div className="checkout-images-container" > 
        <img
          src={process.env.PUBLIC_URL + '/images/Swish.png'}
          alt="Swish"
          className="checkout-image"
          onClick={checkInputBeforeSwish} 
        />
        
        <img
        
    src={process.env.PUBLIC_URL + '/images/Card.jpg'}
    alt="Card"
    className="checkout-image"
    onClick={() => {
      checkInputforCard();
    }}/>

      </div>
      {isCartEmpty && totalPrice <= 1 && (
  <p className="error-checkout-message">Cart is empty.</p>
)}
      {showPhoneNumberInput && (
        <div className="phone-input-container">
          <input
            type="text"
            id="phone-input"
            placeholder="Mobile Number"
            value={phoneNumber}
            onChange={checkSwishChange}
            maxLength={10}
            className="phone-input"
            onKeyPress={(e) => {
              if (isNaN(Number(e.key))) {
                e.preventDefault();
              }
            }}
          />
          <Link
  to="/confirmpage"
  className={`buttonInWindow${isButtonDisabledSwish ? ' disabled' : ''}`}
  onClick={swishPayButton}
  style={{ pointerEvents: isButtonDisabledSwish ? 'none' : 'auto' }}
>
  Pay
</Link>
        </div>
      )}

{showCreditCardInput && (
  <div className="credit-card-input-container">
    <input
      type="text"
      id="owner-input"
      value={owner}
      maxLength={21}
      onChange={checkOwnerChange}
      placeholder="Owner"
      onKeyPress={(e) => {
        const charCode = e.charCode || e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode);

        if (!/[A-Za-z]/.test(charStr)) {
          e.preventDefault();
        }
      }}
    />
    <input
      type="text"
      id="card-number-input"
      value={cardNumber}
      onChange={checkcardNumberChange}
      placeholder="Card Number"
      maxLength={16}
      onKeyPress={(e) => {
        if (isNaN(Number(e.key))) {
          e.preventDefault();
        }
      }}
    />
    <input
      type="text"
      id="cvv-input"
      className="cvv-input"
      value={cvv}
      onChange={checkCVVchange}
      placeholder="CVC"
      maxLength={3}
      onKeyPress={(e) => {
        if (isNaN(Number(e.key))) {
          e.preventDefault();
        }
      }}
    />

    <div className="expiration-input">
      <input
        type="text"
        id="expiration-month-input"
        value={expirationDate.month}
        onChange={checkExpirationMonthchange}
        placeholder="MM"
        maxLength={2}
        inputMode="numeric"
        onKeyPress={(e) => {
          if (isNaN(Number(e.key))) {
            e.preventDefault();
          }
        }}
      />
      <span>/</span>
      <input
        type="text"
        id="expiration-year-input"
        value={expirationDate.year}
        onChange={checkExparationYearChange}
        placeholder="YY"
        maxLength={2}
        onKeyPress={(e) => {
          if (isNaN(Number(e.key))) {
            e.preventDefault();
          }
        }}
      />
    </div>

  
    <Link
  to="/confirmpage"
  className={`buttonInWindow${isButtonDisabled ? ' disabled' : ''}`}
  onClick={isButtonDisabled ? null : CardPayButton}
  style={{ pointerEvents: isButtonDisabled ? 'none' : 'auto' }}
>
  Checkout
</Link>

  
  
  </div>
)}
    </div>
    
  );
}

export default CheckoutPage;
