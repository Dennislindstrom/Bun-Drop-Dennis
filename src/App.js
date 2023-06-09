import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Routes } from 'react-router-dom';
import SodaMenu from './components/SodaMenu';
import FriesMenu from './components/FriesMenu';
import CheckoutPage from './components/CheckoutPage';
import Confirmpage from './components/Confirmpage';


function App() {
  const [hamburgers, setHamburgers] = useState([]);
  const [veganburgers, setVeganburgers] = useState([]);
  const [sodas, setSodas] = useState([]);
  const [fries, setFries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({});

  const [showCart, setShowCart] = useState(false);

  const [selectedSoda, setSelectedSoda] = useState(null);
  const [selectedBurger, setSelectedBurger] = useState(null);
  const [selectedFries, setSelectedFries] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSodaQuantity, setSelectedSodaQuantity] = useState(1);
  const [selectedFriesQuantity, setSelectedFriesQuantity] = useState(1);
  

  useEffect(() => {
    const fetchHamburgers = fetch('http://localhost:7000/hamburgers');
    const fetchVeganburgers = fetch('http://localhost:7000/veganburgers');
    const fetchSodas = fetch('http://localhost:7000/sodas');
    const fetchFries = fetch('http://localhost:7000/fries');
    const storedOrder = loadOrderFromLocalStorage();
    setOrder(storedOrder);
    setLoading(false);

    Promise.all([fetchHamburgers, fetchVeganburgers, fetchSodas, fetchFries])
      .then((responses) => Promise.all(responses.map((response) => response.json())))
      .then(([hamburgersData, veganburgersData, sodasData, friesData]) => {
        setHamburgers(hamburgersData);
        setVeganburgers(veganburgersData);
        setSodas(sodasData);
        setFries(friesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  function saveOrderToLocalStorage(order) {
    localStorage.setItem('order', JSON.stringify(order));
  }

  function loadOrderFromLocalStorage() {
    const order = localStorage.getItem('order');
    return order ? JSON.parse(order) : {};
  }


  function scrollToVeggieBurger(event) {
    event.preventDefault();
    const element = document.getElementById('veggieburgers');
    const yOffset = -60; 
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function burgerClick(burger) {
    setSelectedBurger(burger);
    setQuantity(1);
  }
  function sodaClick(soda) {
    setSelectedSoda(soda);
    setSelectedSodaQuantity(1);
  }

  function FryClick(friesItem){
    setSelectedFries(friesItem)
    setSelectedFriesQuantity(1);
  }


  function burgerIncreaseInModal() {
    if (quantity < 10) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  }
  function burgerDecreaseInModal() {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  }
  function sodaIncreaseInModal() {
    if (selectedSodaQuantity < 10) {
      setSelectedSodaQuantity((prevQuantity) => prevQuantity + 1);
    }
  }
  function sodaDecreaseInModal() {
    setSelectedSodaQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  }
  function fryIncreaseInModal() {
    if (selectedFriesQuantity < 10) {
      setSelectedFriesQuantity((prevQuantity) => prevQuantity + 1);
    }
  }
  function fryDecreaseInModal () {
    setSelectedFriesQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  }


  function addBurgerToCart() {
    if (selectedBurger && selectedBurger.price && quantity >= 1 && quantity <= 10) {
      const currentQuantity = quantity;
      const totalPrice = parseFloat(selectedBurger.price) * currentQuantity;
  
      setOrder((previousOrder) => {
        const updatedOrder = { ...previousOrder };
  
        const burgerId = selectedBurger.id;
  
        if (updatedOrder[burgerId]) {
          const newQuantity = updatedOrder[burgerId].quantity + currentQuantity;
          updatedOrder[burgerId] = {
            ...updatedOrder[burgerId],
            quantity: newQuantity <= 10 ? newQuantity : 10, 
            totalPrice: updatedOrder[burgerId].totalPrice + totalPrice,
          };
        } else {
          updatedOrder[burgerId] = {
            burger: selectedBurger,
            sodas: {},
            quantity: currentQuantity <= 10 ? currentQuantity : 10, 
            totalPrice: totalPrice,
          };
        }
  
        saveOrderToLocalStorage(updatedOrder); 
        const sodasLabelElement = document.querySelector('.sodas-label');
        if (sodasLabelElement) {
          sodasLabelElement.scrollIntoView({ behavior: 'smooth' });
        }
        setShowCart(true);
        return updatedOrder;
      });
    }
  }
  

  function addFryToCart() {
    if (selectedFries && selectedFries.price && selectedFriesQuantity >= 1) {
      const currentQuantity = selectedFriesQuantity;
      const totalPrice = parseFloat(selectedFries.price) * currentQuantity;
  
      setOrder((previousOrder) => {
        const updatedOrder = { ...previousOrder };
  
        const friesId = selectedFries.id;
  
        if (updatedOrder[friesId]) {
          updatedOrder[friesId] = {
            ...updatedOrder[friesId],
            quantity: updatedOrder[friesId].quantity + currentQuantity,
            totalPrice: updatedOrder[friesId].totalPrice + totalPrice,
          };
        } else {
          updatedOrder[friesId] = {
            fries: selectedFries,
            quantity: currentQuantity,
            totalPrice: totalPrice,
          };
        }
  
        saveOrderToLocalStorage(updatedOrder); 
        return updatedOrder;
      });
  
      setSelectedFriesQuantity(1);
      setSelectedFries(null);
      setShowCart(true);
      
    }
  }
  function addSodaToCart() {
    if (selectedSoda && selectedSoda.price && selectedSodaQuantity >= 1) {
      const currentSodaQuantity = selectedSodaQuantity;
      const totalPrice = parseFloat(selectedSoda.price) * currentSodaQuantity;
  
      setOrder((prevOrder) => {
        const updatedOrder = { ...prevOrder };
  
        const sodaId = `soda_${selectedSoda.id}`;
        console.log('sodaId:', sodaId);
  
        if (selectedBurger && updatedOrder[selectedBurger.id]) {
          const burgerId = selectedBurger.id;
          console.log('burgerId:', burgerId);
  
          if (updatedOrder[burgerId].sodas) {
            const existingSoda = updatedOrder[burgerId].sodas[sodaId];
  
            if (existingSoda) {
              const newQuantity = existingSoda.quantity + currentSodaQuantity;
              const newTotalPrice = existingSoda.totalPrice + totalPrice;
  
              updatedOrder[burgerId].sodas[sodaId] = {
                ...existingSoda,
                quantity: newQuantity,
                totalPrice: newTotalPrice,
              };
            } else {
              updatedOrder[burgerId].sodas[sodaId] = {
                soda: selectedSoda,
                quantity: currentSodaQuantity,
                totalPrice: totalPrice,
              };
            }
          } else {
            updatedOrder[burgerId].sodas = {
              [sodaId]: {
                soda: selectedSoda,
                quantity: currentSodaQuantity,
                totalPrice: totalPrice,
              },
            };
          }
        } else {
          if (updatedOrder[sodaId]) {
            const existingSoda = updatedOrder[sodaId];
            const newQuantity = existingSoda.quantity + currentSodaQuantity;
            const newTotalPrice = existingSoda.totalPrice + totalPrice;
  
            updatedOrder[sodaId] = {
              ...existingSoda,
              quantity: newQuantity,
              totalPrice: newTotalPrice,
            };
          } else {
            updatedOrder[sodaId] = {
              soda: selectedSoda,
              quantity: currentSodaQuantity,
              totalPrice: totalPrice,
            };
          }
        }
  
        saveOrderToLocalStorage(updatedOrder);
  
        return updatedOrder;
      });
      setSelectedSoda(null);
      setSelectedSodaQuantity(1); 
    }
  }


  function closeModalToSoda(event) {
    if (event.target.classList.contains('modal-overlay')) {
      setSelectedSoda(null);
      setSelectedSodaQuantity(1);
    }
  }
  function closeModalToBurger(event) {
    if (event.target.classList.contains('modal-overlay')) {
      setSelectedBurger(null);
    }
  }
  function closeModalToFries(event) {
    if (event.target.classList.contains('modal-overlay')) {
      setSelectedFries(null);
    }
  }


  function increaseBurgerQuantityInCart(burgerId) {
    setOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
  
      if (updatedOrder[burgerId]) {
        const burger = updatedOrder[burgerId].burger;
        if (burger) {
          const quantity = updatedOrder[burgerId].quantity + 1;
          const totalPrice = parseFloat(burger.price) * quantity;
  
          updatedOrder[burgerId] = {
            ...updatedOrder[burgerId],
            quantity: quantity,
            totalPrice: totalPrice,
          };
        }
      }
  
      saveOrderToLocalStorage(updatedOrder); 
  
      return updatedOrder;
    });
  }
  function decreaseBurgerQuantityInCart(burgerId) {
    setOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
  
      if (updatedOrder[burgerId]) {
        const quantity = Math.max(updatedOrder[burgerId].quantity - 1, 0);
        const totalPrice = parseFloat(updatedOrder[burgerId].burger.price) * quantity;
  
        if (quantity <= 0) {
          delete updatedOrder[burgerId];
        } else {
          updatedOrder[burgerId] = {
            ...updatedOrder[burgerId],
            quantity: quantity,
            totalPrice: totalPrice,
          };
        }
      }
  
      saveOrderToLocalStorage(updatedOrder); 
  
      return updatedOrder;
    });
  }
  function increaseSodaQuantityInCart(sodaId) {
    const formattedSodaId = `soda_${sodaId}`;
    setOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
  
      
      if (updatedOrder[formattedSodaId] && updatedOrder[formattedSodaId].soda && updatedOrder[formattedSodaId].soda.price) {
        const existingSoda = updatedOrder[formattedSodaId];
        const newQuantity = existingSoda.quantity + 1;
        const newTotalPrice = existingSoda.totalPrice + parseFloat(existingSoda.soda.price);
  
        updatedOrder[formattedSodaId] = {
          ...existingSoda,
          quantity: newQuantity,
          totalPrice: newTotalPrice,
        };
  
        saveOrderToLocalStorage(updatedOrder); 
      } else {
      }
  
      return updatedOrder;
    });
  }
  function decreaseSodaQuantityInCart(sodaId) {
    const formattedSodaId = `soda_${sodaId}`;
    setOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
  
      
      if (updatedOrder[formattedSodaId] && updatedOrder[formattedSodaId].soda && updatedOrder[formattedSodaId].soda.price) {
        const existingSoda = updatedOrder[formattedSodaId];
        const newQuantity = existingSoda.quantity - 1;
        const newTotalPrice = existingSoda.totalPrice - parseFloat(existingSoda.soda.price);
  
        
        if (newQuantity > 0) {
          updatedOrder[formattedSodaId] = {
            ...existingSoda,
            quantity: newQuantity,
            totalPrice: newTotalPrice,
          };
        } else {
          delete updatedOrder[formattedSodaId];
        }
  
        saveOrderToLocalStorage(updatedOrder); 
      } else {
        
        console.log("Invalid sodaId or soda does not exist");
      }
  
      return updatedOrder;
    });
  }
  function increaseFryQuantityInCart(friesId) {
    setOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
  
      if (updatedOrder[friesId]) {
        const fries = updatedOrder[friesId].fries;
        if (fries) {
          const quantity = updatedOrder[friesId].quantity + 1;
          const totalPrice = parseFloat(fries.price) * quantity;
  
          updatedOrder[friesId] = {
            ...updatedOrder[friesId],
            quantity: quantity,
            totalPrice: totalPrice,
          };
  
          saveOrderToLocalStorage(updatedOrder); 
        }
      }
  
      return updatedOrder;
    });
  }

  function decreaseFryQuantityInCart(friesId) {
  setOrder((prevOrder) => {
    const updatedOrder = { ...prevOrder };

    if (updatedOrder[friesId]) {
      const fries = updatedOrder[friesId].fries;
      if (fries) {
        const quantity = updatedOrder[friesId].quantity - 1;
        const totalPrice = parseFloat(fries.price) * quantity;

        if (quantity <= 0) {

          delete updatedOrder[friesId];
        } else {
          updatedOrder[friesId] = {
            ...updatedOrder[friesId],
            quantity: quantity,
            totalPrice: totalPrice,
          };
        }

        saveOrderToLocalStorage(updatedOrder);
      }
    }

    return updatedOrder;
  });
}


  function toggleCart() {
    setShowCart((prevState) => !prevState);
  }


  function Cart() {
    let burgerTotalPrice = 0;
    let sodaTotalPrice = 0;
    let friesTotalPrice = 0;
  
    const burgerItems = Object.values(order).map((item) => {
      const { burger, quantity, totalPrice } = item;
      if (burger) {
        burgerTotalPrice += totalPrice;
  
        return (
          <div key={burger.id}>
                      <span>
                 {quantity}x {burger.title}
                 
                  <button className="decrease-button" onClick={() => decreaseBurgerQuantityInCart(burger.id)}>
                    <span>-</span>
                    </button>
                <button className="increase-button" onClick={() => increaseBurgerQuantityInCart(burger.id)}>
                <span>+</span>
              </button>
          </span>
        </div>
        );
      }
  
      return null;
    });
  
    const sodaItems = Object.values(order).map((item) => {
      const { soda, quantity, totalPrice } = item;
      if (soda) {
        sodaTotalPrice += totalPrice;
  
        return (
          <div key={soda.id}>
  <span>
    {quantity}x {soda.title}
    <button
      className="decrease-button"
      onClick={() => decreaseSodaQuantityInCart(soda.id)}><span>-</span>
    </button>
    <button
      className="increase-button"onClick={() => increaseSodaQuantityInCart(soda.id)}><span>+</span>
    </button>
  </span>
</div>
        );
      }
  
      return null;
    });
  
    const friesItems = Object.values(order).map((item) => {
      const { fries, quantity, totalPrice } = item;
      if (fries) {
        friesTotalPrice += totalPrice;
  
        return (
          <div key={fries.id}>
            <span>
              {quantity}x {fries.title}
              <button  className="decrease-button" onClick={() => decreaseFryQuantityInCart(fries.id)}>
              <span>-</span>
              </button>
              <button className="increase-button" onClick={() => increaseFryQuantityInCart(fries.id)}>
              <span>+</span>
              </button>
            </span>
          </div>
        );
      }
  
      return null;
    });
  
    return (
      <div>
        <em>{burgerItems} </em>
        <hr></hr>
      <em>{sodaItems}</em>
      <hr></hr>
      <em>{friesItems}</em>
        < Link to="/checkoutpage" className="CheckOutButton">Checkout</Link>
      </div>
    );
  }
  

  return (
    <Router>
    <Routes>
    <Route path="/" element={ 
    <div className="burger-container">
      <div className="navbar">
        <a href="#hamburgers">Hamburgers</a>
        <img src={process.env.PUBLIC_URL + '/images/logo-color.png'} alt="Logo" className="navbar-logo"/>

        <a href="#veggieburgers" onClick={scrollToVeggieBurger}>
          Veggie Burgers
        </a>
        <span className="cart-toggle" onClick={toggleCart}>
    {showCart ? (
      <img src="/images/Cart.png" alt="Cart" />
    ) : (
      <img src="/images/Cart.png" alt="Cart" /> 
    )}
  </span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        <hr></hr>
        <label className="burger-label">Burgers</label>
          <div id="hamburgers" className="burger-list">
            
            {hamburgers.map((burger) => (
              
              <div
                className="burger-item"
                key={burger.id}
                onClick={() => burgerClick(burger)}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/${burger.image}`}
                  alt={burger.title}
                />
                 <div className="burger-info">
                  <h3>{burger.title}</h3>
                  <h3 className="price-h3">{burger.price}</h3>
                  <p>{burger.description}</p>
                </div>
              </div>
            ))}
            
          </div>
          <hr></hr>
          <label className="vegan-veggie-burger-label">Vegan / Veggie burgers</label>
          <div id="veggieburgers" className="burger-list">
            {veganburgers.map((burger) => (
              <div
                className="burger-item"
                key={burger.id}
                onClick={() => burgerClick(burger)}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/${burger.image}`}
                  alt={burger.title}
                />
                <div className="burger-info">
                  <h3>{burger.title}</h3>
                  <h3 className="price-h3">{burger.price}</h3>
                  <p>{burger.description}</p>
                </div>
                
              </div>
              
              
            ))}
          </div>
          <hr></hr>
          <label className="sodas-label">Sodas</label> 
          <SodaMenu sodas={sodas} sodaClick={sodaClick}/>
          <hr></hr>
          <label className="fries-label">Fries</label> 
          <FriesMenu fries={fries} FryClick={FryClick} />
        </>
      )}

{selectedBurger && (
        <div className="modal-overlay" onClick={closeModalToBurger}>
          <div className="modal">
            <h3>{selectedBurger.title}</h3>
            <p>{selectedBurger.description}</p>
            <div>
              <label>Quantity: {quantity}</label>
              <button onClick={burgerDecreaseInModal} className="decrease-button"><span>-</span></button>
              <button onClick={burgerIncreaseInModal} className="increase-button"><span>+</span></button>
              <p>{parseFloat(selectedBurger.price) * quantity || 0} kr</p>
            </div>
            <button onClick={() => {
              addBurgerToCart();
              setSelectedBurger(null);
            }}>Add to Cart</button>
          </div>
        </div>
      )}

{selectedSoda && (
  <div className="modal-overlay" onClick={closeModalToSoda}>
    <div className="modal">
      <h3>{selectedSoda.title}</h3>
      <p>{selectedSoda.description}</p>
      <div>
        <label>Quantity: {selectedSodaQuantity}
          <button onClick={sodaDecreaseInModal} className="decrease-button"><span>-</span></button>
        </label>
        <button onClick={sodaIncreaseInModal} className="increase-button"><span>+</span></button>
      </div>
      <button onClick={addSodaToCart}>Add to Cart</button>
    </div>
  </div>
)}

{selectedFries && (
  <div className="modal-overlay" onClick={closeModalToFries}>
    <div className="modal">
      <h3>{selectedFries.title}</h3>
      <p>{selectedFries.description}</p>
      <div>
        <label>Quantity: {selectedFriesQuantity}
          <button onClick={fryDecreaseInModal} className="decrease-button"><span>-</span></button>
        </label>
        <button onClick={fryIncreaseInModal} className="increase-button"><span>+</span></button>
      </div>
      <button onClick={addFryToCart}>Add to Cart</button>
    </div>
  </div>
)}


{showCart && Object.keys(order).length > 0 && (
          <div className="cart-sticky">
            <div className="cart">
              <h2>Cart</h2>
              {Cart()}
              <span className="cart-toggle-displayed" onClick={toggleCart}>
              &#9660;
            </span>
            </div>
          </div>
        )}

        </div>
    }/>

    <Route path="/checkoutpage" element={<CheckoutPage order={order} setOrder={setOrder} />} />
    <Route path="/confirmpage" element={<Confirmpage />} />
      </Routes>
    </Router>
  );
}

export default App;