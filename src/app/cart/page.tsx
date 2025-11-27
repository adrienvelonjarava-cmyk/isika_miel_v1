"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";
import useCartStore from "@/stores/cartStore";
import { ShippingFormInputs } from "@/types";
import { ArrowRight, ArrowLeft, Trash2 } from "lucide-react"; // Ajout d'ArrowLeft
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const steps = [
  { id: 1, title: "Shopping Cart" },
  { id: 2, title: "Shipping Address" },
  { id: 3, title: "Payment Method" },
];

const CartPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();

  // S'assurer que activeStep est un nombre entre 1 et 3
  const currentStep = parseInt(searchParams.get("step") || "1");
  const activeStep = Math.min(Math.max(currentStep, 1), steps.length);

  const { cart, removeFromCart } = useCartStore();

  // --- CALCULS DU PANIER ---
  const discountAmount = 3000; // TEMPORAIRE: À rendre dynamique
  const shippingFee = 5000;    // TEMPORAIRE: À rendre dynamique

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  // Total = Subtotal - Discount + Shipping
  const total = subtotal - discountAmount + shippingFee;
  // --------------------------

  // Fonction pour naviguer vers l'étape suivante
  const goToNextStep = () => {
      if (activeStep < steps.length) {
          router.push(`/cart?step=${activeStep + 1}`, { scroll: false });
      }
  };

  // Fonction pour naviguer vers l'étape précédente
  const goToPreviousStep = () => {
      if (activeStep > 1) {
          router.push(`/cart?step=${activeStep - 1}`, { scroll: false });
      }
  };


  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12">
      {/* TITLE */}
      <h1 className="text-2xl font-medium">Your Shopping Cart</h1>
      {/* STEPS INDICATORS */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {steps.map((step) => (
          <div
            className={`flex items-center gap-2 border-b-2 pb-4 ${
              step.id === activeStep ? "border-gray-800" : "border-gray-200"
            }`}
            key={step.id}
          >
            <div
              className={`w-6 h-6 rounded-full text-white p-4 flex items-center justify-center ${
                step.id === activeStep ? "bg-gray-800" : "bg-gray-400"
              }`}
            >
              {step.id}
            </div>
            <p
              className={`text-sm font-medium ${
                step.id === activeStep ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
      
      {/* STEPS CONTENT & DETAILS */}
      <div className="w-full flex flex-col lg:flex-row gap-16">
        {/* STEPS CONTENT (LEFT SIDE) */}
        <div className="w-full lg:w-7/12 shadow-lg border border-gray-100 p-8 rounded-lg flex flex-col gap-8">
          {/* STEP 1: CART ITEMS */}
          {activeStep === 1 ? (
            cart.length === 0 ? (
                <p className="text-lg text-gray-500 text-center">Your cart is empty.</p>
            ) : (
                cart.map((item) => (
                    // SINGLE CART ITEM
                    <div
                      className="flex items-center justify-between"
                      key={item.id + item.selectedSize + item.selectedColor}
                    >
                      {/* IMAGE AND DETAILS */}
                      <div className="flex gap-8">
                        {/* IMAGE */}
                        <div className="relative w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                          <Image
                            // Vérifiez si l'image existe pour la couleur sélectionnée
                            src={item.images[item.selectedColor] || item.images[Object.keys(item.images)[0]]} 
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        {/* ITEM DETAILS */}
                        <div className="flex flex-col justify-between">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-xs text-gray-500">
                              Size: {item.selectedSize}
                            </p>
                          </div>
                          <p className="font-medium">{(item.price * item.quantity).toFixed(2)} Ariary</p>
                        </div>
                      </div>
                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => removeFromCart(item)}
                        className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 text-red-400 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
            )
          ) : 
          
          /* STEP 2: SHIPPING FORM */
          activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : 
          
          /* STEP 3: PAYMENT FORM */
          activeStep === 3 ? (
             // Si l'utilisateur est à l'étape 3, il doit avoir rempli le formulaire d'expédition.
             shippingForm ? (
                <PaymentForm />
             ) : (
                <p className="text-sm text-red-500">
                    Shipping information is missing. Please go back to step 2.
                </p>
             )
          ) : (
             <></> // Cas par défaut, ne devrait pas arriver grâce au Math.min/max
          )}

          {/* NAVIGATION BUTTONS (BACK) */}
          {activeStep > 1 && (
            <button
                onClick={goToPreviousStep}
                className="w-fit bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-gray-800 p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
                <ArrowLeft className="w-3 h-3" />
                Back
            </button>
          )}

        </div>
        
        {/* DETAILS (RIGHT SIDE) */}
        <div className="w-full lg:w-5/12 shadow-lg border border-gray-100 p-8 rounded-lg flex flex-col gap-8 h-max">
          <h2 className="font-semibold">Cart Details</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Subtotal</p>
              <p className="font-medium">
                {subtotal.toFixed(2)} Ariary
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Discount</p>
              <p className="font-medium">
                -{discountAmount.toFixed(2)} Ariary 
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Shipping Fee</p>
              <p className="font-medium">
                +{shippingFee.toFixed(2)} Ariary
              </p>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <p className="text-gray-800 font-semibold">Total</p>
              <p className="font-medium">
                {total.toFixed(2)} Ariary 
              </p>
            </div>
          </div>
          
          {/* NAVIGATION BUTTONS (CONTINUE) */}
          {activeStep < steps.length && (
            <button
                onClick={goToNextStep}
                disabled={activeStep === 2 && !shippingForm} // Désactiver si à l'étape 2 et formulaire non rempli
                className={`w-full transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2 ${
                    (activeStep === 2 && !shippingForm) 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gray-800 hover:bg-gray-900'
                }`}
            >
                Continue
                <ArrowRight className="w-3 h-3" />
            </button>
          )}
          
          {/* PLACE ORDER BUTTON (STEP 3) */}
          {activeStep === 3 && (
            <button
                // Logique de commande finale ici (à implémenter)
                className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
            >
                Place Order
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartPage;
