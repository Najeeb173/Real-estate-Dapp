"use client";

import { useWeb3 } from "../context/web3Context";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./globals.css";
import "./style.css";

export default function Home() {
  const { account, contract, network, connectWallet } = useWeb3();

  // State Management
  const [properties, setProperties] = useState([]);
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("explore");
  const [propertyReviews, setPropertyReviews] = useState({});
  const [userReviews, setUserReviews] = useState([]);
  const [highestRated, setHighestRated] = useState(null);

  // Form States
  const [listForm, setListForm] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    address: "",
    description: ""
  });

  const [editForm, setEditForm] = useState({
    id: null,
    title: "",
    category: "",
    image: "",
    address: "",
    description: ""
  });

  const [priceUpdateForm, setPriceUpdateForm] = useState({
    propertyId: null,
    newPrice: ""
  });

  /*//////////////////////////////////////////////////////////////
                        RANDOM IMAGE GENERATOR
  //////////////////////////////////////////////////////////////*/

  const propertyImages = [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&q=80",
    "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&q=80",
    "https://images.unsplash.com/photo-1600563438938-a650c6c5f0f3?w=800&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80"
  ];

  const getPropertyImage = (customUrl, propertyId) => {
    if (customUrl && customUrl.trim() !== "") {
      try {
        new URL(customUrl);
        return customUrl;
      } catch {
        // Fall through to random selection
      }
    }
    
    if (propertyId !== undefined && propertyId !== null) {
      const index = propertyId % propertyImages.length;
      return propertyImages[index];
    }
    
    const randomIndex = Math.floor(Math.random() * propertyImages.length);
    return propertyImages[randomIndex];
  };

  /*//////////////////////////////////////////////////////////////
                        LOAD DATA ON MOUNT
  //////////////////////////////////////////////////////////////*/

  useEffect(() => {
    if (contract && account) {
      loadAllData();
    }
  }, [contract, account]);

  const loadAllData = async () => {
    await Promise.all([
      fetchAllProperties(),
      fetchUserProperties(),
      fetchUserReviews(),
      fetchHighestRated()
    ]);
  };

  /*//////////////////////////////////////////////////////////////
                        PROPERTY FUNCTIONS
  //////////////////////////////////////////////////////////////*/

  const fetchAllProperties = async () => {
    if (!contract) return;
    try {
      const data = await contract.getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error("Fetch all properties error:", err);
    }
  };

  const fetchUserProperties = async () => {
    if (!contract || !account) return;
    try {
      const data = await contract.getUserProperties(account);
      setUserProperties(data);
    } catch (err) {
      console.error("Fetch user properties error:", err);
    }
  };

  const listProperty = async () => {
    if (!contract || !listForm.title || !listForm.price || !listForm.category) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = listForm.image.trim() !== "" 
        ? listForm.image 
        : propertyImages[Math.floor(Math.random() * propertyImages.length)];

      const tx = await contract.listProperties(
        account,
        ethers.utils.parseEther(listForm.price),
        listForm.title,
        listForm.category,
        imageUrl,
        listForm.address || "Address not specified",
        listForm.description || "No description provided"
      );

      await tx.wait();
      alert("✅ Property listed successfully!");
      
      setListForm({ title: "", price: "", category: "", image: "", address: "", description: "" });
      await loadAllData();
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async () => {
    if (!contract || !editForm.id || !editForm.title || !editForm.category) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = editForm.image.trim() !== "" 
        ? editForm.image 
        : propertyImages[Math.floor(Math.random() * propertyImages.length)];

      const tx = await contract.updateProperty(
        account,
        editForm.id,
        editForm.title,
        editForm.category,
        imageUrl,
        editForm.address || "Address not specified",
        editForm.description || "No description provided"
      );

      await tx.wait();
      alert("✅ Property updated successfully!");
      
      setEditForm({ id: null, title: "", category: "", image: "", address: "", description: "" });
      await loadAllData();
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async () => {
    if (!contract || !priceUpdateForm.propertyId || !priceUpdateForm.newPrice) {
      alert("Please fill in property ID and new price!");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.updatePrice(
        account,
        priceUpdateForm.propertyId,
        ethers.utils.parseEther(priceUpdateForm.newPrice)
      );

      await tx.wait();
      alert("✅ Price updated successfully!");
      
      setPriceUpdateForm({ propertyId: null, newPrice: "" });
      await loadAllData();
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const buyProperty = async (id, price) => {
    if (!contract) return;

    setLoading(true);
    try {
      const tx = await contract.buyProperties(id, account, {
        value: price,
      });

      await tx.wait();
      alert("✅ Property purchased successfully!");
      await loadAllData();
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  /*//////////////////////////////////////////////////////////////
                        REVIEW FUNCTIONS
  //////////////////////////////////////////////////////////////*/

  const fetchPropertyReviews = async (propertyId) => {
    if (!contract) return;
    try {
      const reviews = await contract.getProductReviews(propertyId);
      setPropertyReviews(prev => ({ ...prev, [propertyId]: reviews }));
    } catch (err) {
      console.error("Fetch property reviews error:", err);
    }
  };

  const fetchUserReviews = async () => {
    if (!contract || !account) return;
    try {
      const reviews = await contract.getUserReviews(account);
      setUserReviews(reviews);
    } catch (err) {
      console.error("Fetch user reviews error:", err);
    }
  };

  const fetchHighestRated = async () => {
    if (!contract) return;
    try {
      const id = await contract.getHighestRatedProduct();
      if (id.toNumber() !== 0 || properties.length > 0) {
        const prop = properties.find(p => p.productID.toString() === id.toString());
        setHighestRated(prop);
      }
    } catch (err) {
      console.error("Fetch highest rated error:", err);
    }
  };

  /*//////////////////////////////////////////////////////////////
                        PROPERTY CARD COMPONENT
  //////////////////////////////////////////////////////////////*/

  const PropertyCard = ({ property, isOwned = false }) => {
    const [showReviews, setShowReviews] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [localReviews, setLocalReviews] = useState([]);

    // Load reviews when showing
    const handleShowReviews = async () => {
      const newState = !showReviews;
      setShowReviews(newState);
      
      if (newState && contract) {
        try {
          const reviews = await contract.getProductReviews(property.productID);
          setLocalReviews(reviews);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      }
    };

    const handleSubmitReview = async () => {
      if (!reviewComment.trim()) {
        alert("Please write a comment!");
        return;
      }
      
      if (!contract || !account) {
        alert("Please connect your wallet!");
        return;
      }

      setIsSubmitting(true);
      try {
        console.log("Submitting review:", {
          propertyId: property.productID.toString(),
          rating: reviewRating,
          comment: reviewComment,
          account: account
        });

        const tx = await contract.addReview(
          property.productID,
          reviewRating,
          reviewComment,
          account
        );

        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        
        alert("✅ Review added successfully!");
        
        // Reset form
        setReviewComment("");
        setReviewRating(5);
        
        // Reload just this property's reviews
        const updatedReviews = await contract.getProductReviews(property.productID);
        setLocalReviews(updatedReviews);
        
      } catch (error) {
        console.error("Review submission error:", error);
        alert(error.reason || error.message || "Failed to submit review");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleLikeReview = async (reviewIndex) => {
      if (!contract || !account) {
        alert("Please connect your wallet!");
        return;
      }

      setIsLiking(true);
      try {
        const tx = await contract.likeReview(property.productID, reviewIndex, account);
        await tx.wait();
        alert("✅ Review liked!");
        
        // Reload just this property's reviews
        const updatedReviews = await contract.getProductReviews(property.productID);
        setLocalReviews(updatedReviews);
      } catch (err) {
        console.error(err);
        alert(err.reason || err.message || "Failed to like review");
      } finally {
        setIsLiking(false);
      }
    };

    return (
      <div className="property-card group">
        <div className="property-image-container">
          <img
            src={imgError 
              ? getPropertyImage(null, property.productID.toNumber())
              : getPropertyImage(property.images, property.productID.toNumber())
            }
            alt={property.propertyTitle}
            className="property-image"
            onError={() => {
              if (!imgError) {
                setImgError(true);
              }
            }}
          />
          <div className="property-badge">
            #{property.productID.toString()}
          </div>
        </div>

        <div className="property-content">
          <h3 className="property-title">{property.propertyTitle}</h3>
          
          <div className="property-price">
            {ethers.utils.formatEther(property.price)} ETH
          </div>

          <div className="property-details">
            <div className="detail-item">
              <span className="detail-icon">🏷️</span>
              <span>{property.category}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span>{property.propertyAddress}</span>
            </div>
          </div>

          <p className="property-description">{property.description}</p>

          <div className="property-owner">
            Owner: {property.owner.slice(0, 6)}...{property.owner.slice(-4)}
          </div>

          {isOwned && (
            <div className="property-actions">
              <button
                onClick={() => {
                  setEditForm({
                    id: property.productID,
                    title: property.propertyTitle,
                    category: property.category,
                    image: property.images,
                    address: property.propertyAddress,
                    description: property.description
                  });
                  setActiveTab("manage");
                }}
                className="btn-secondary"
              >
                Edit Property
              </button>
              <button
                onClick={() => {
                  setPriceUpdateForm({
                    propertyId: property.productID,
                    newPrice: ethers.utils.formatEther(property.price)
                  });
                  setActiveTab("manage");
                }}
                className="btn-secondary"
              >
                Update Price
              </button>
            </div>
          )}

          {!isOwned && property.owner.toLowerCase() !== account?.toLowerCase() && (
            <button
              onClick={() => buyProperty(property.productID, property.price)}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Processing..." : "Buy Property"}
            </button>
          )}

          <div className="review-section">
            <button
              onClick={handleShowReviews}
              className="btn-link"
            >
              {showReviews ? "Hide" : "Show"} Reviews ({property.reviewers.length})
            </button>

            {showReviews && (
              <div className="reviews-list">
                {localReviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                  localReviews.map((review, idx) => (
                    <div key={idx} className="review-item">
                      <div className="review-header">
                        <div className="review-rating">
                          {"⭐".repeat(review.rating.toNumber())}
                        </div>
                        <button
                          onClick={() => handleLikeReview(idx)}
                          className="review-like"
                          disabled={isLiking}
                        >
                          ❤️ {review.likes.toString()}
                        </button>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <p className="review-author">
                        By: {review.reviewer.slice(0, 6)}...{review.reviewer.slice(-4)}
                      </p>
                    </div>
                  ))
                )}

                <div className="add-review-form">
                  <h4>Add Your Review</h4>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="review-rating-select input"
                    disabled={isSubmitting}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{"⭐".repeat(n)} ({n} {n === 1 ? 'star' : 'stars'})</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Write your review comment here..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="review-textarea textarea"
                    disabled={isSubmitting}
                    maxLength={500}
                  />
                  <div className="char-count">
                    {reviewComment.length}/500 characters
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    className="btn-primary"
                    disabled={isSubmitting || !reviewComment.trim()}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /*//////////////////////////////////////////////////////////////
                              RENDER
  //////////////////////////////////////////////////////////////*/

  return (
    <div className="container">
        <div className="header">
          <h1 className="logo">Estate Chain</h1>
          <p className="tagline">Blockchain Real Estate Marketplace</p>
        </div>

        {!account ? (
          <div className="wallet-info">
            <button onClick={connectWallet} className="connect-btn" disabled={loading}>
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
            <p className="wallet-hint">
              Connect your MetaMask to access the marketplace
            </p>
          </div>
        ) : (
          <>
            <div className="wallet-info">
              <p>
                <strong>Connected:</strong> {account.slice(0, 6)}...{account.slice(-4)}
              </p>
              {network && (
                <p className="network-info">
                  Network: {network.name} (Chain {network.chainId})
                </p>
              )}
            </div>

            {highestRated && (
              <div className="highlight-card">
                <div className="highlight-title">🏆 Highest Rated Property</div>
                <PropertyCard property={highestRated} />
              </div>
            )}

            <div className="tabs">
              <div
                className={`tab ${activeTab === "explore" ? "active" : ""}`}
                onClick={() => setActiveTab("explore")}
              >
                🏘️ Explore
              </div>
              <div
                className={`tab ${activeTab === "myProperties" ? "active" : ""}`}
                onClick={() => setActiveTab("myProperties")}
              >
                🏠 My Properties
              </div>
              <div
                className={`tab ${activeTab === "list" ? "active" : ""}`}
                onClick={() => setActiveTab("list")}
              >
                ➕ List Property
              </div>
              <div
                className={`tab ${activeTab === "manage" ? "active" : ""}`}
                onClick={() => setActiveTab("manage")}
              >
                ⚙️ Manage
              </div>
              <div
                className={`tab ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                ⭐ My Reviews
              </div>
            </div>

            {activeTab === "explore" && (
              <div>
                <h2 className="section-title">
                  All Properties ({properties.length})
                </h2>
                {properties.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🏘️</div>
                    <p>No properties listed yet. Be the first to list one!</p>
                  </div>
                ) : (
                  <div className="grid">
                    {properties.map((prop, idx) => (
                      <PropertyCard key={idx} property={prop} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "myProperties" && (
              <div>
                <h2 className="section-title">
                  My Properties ({userProperties.length})
                </h2>
                {userProperties.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🏠</div>
                    <p>You don't own any properties yet.</p>
                  </div>
                ) : (
                  <div className="grid">
                    {userProperties.map((prop, idx) => (
                      <PropertyCard key={idx} property={prop} isOwned={true} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "list" && (
              <div className="form-container">
                <h2 className="form-title">List New Property</h2>
                <div className="form-grid">
                  <input
                    className="input"
                    placeholder="Property Title *"
                    value={listForm.title}
                    onChange={(e) => setListForm({...listForm, title: e.target.value})}
                  />
                  <input
                    className="input"
                    placeholder="Price in ETH *"
                    type="number"
                    step="0.001"
                    value={listForm.price}
                    onChange={(e) => setListForm({...listForm, price: e.target.value})}
                  />
                  <input
                    className="input"
                    placeholder="Category *"
                    value={listForm.category}
                    onChange={(e) => setListForm({...listForm, category: e.target.value})}
                  />
                  <input
                    className="input"
                    placeholder="Image URL (optional - random image if empty)"
                    value={listForm.image}
                    onChange={(e) => setListForm({...listForm, image: e.target.value})}
                  />
                  <input
                    className="input"
                    placeholder="Address"
                    value={listForm.address}
                    onChange={(e) => setListForm({...listForm, address: e.target.value})}
                  />
                  <textarea
                    className="textarea"
                    placeholder="Description"
                    value={listForm.description}
                    onChange={(e) => setListForm({...listForm, description: e.target.value})}
                  />
                </div>
                <button onClick={listProperty} className="btn-primary" disabled={loading}>
                  {loading ? "Processing..." : "List Property"}
                </button>
              </div>
            )}

            {activeTab === "manage" && (
              <div>
                <div className="form-container">
                  <h2 className="form-title">Update Property Details</h2>
                  <div className="form-grid">
                    <input
                      className="input"
                      placeholder="Property ID *"
                      type="number"
                      value={editForm.id || ""}
                      onChange={(e) => setEditForm({...editForm, id: parseInt(e.target.value)})}
                    />
                    <input
                      className="input"
                      placeholder="New Title *"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    />
                    <input
                      className="input"
                      placeholder="New Category *"
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    />
                    <input
                      className="input"
                      placeholder="New Image URL (optional)"
                      value={editForm.image}
                      onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                    />
                    <input
                      className="input"
                      placeholder="New Address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    />
                    <textarea
                      className="textarea"
                      placeholder="New Description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    />
                  </div>
                  <button onClick={updateProperty} className="btn-primary" disabled={loading}>
                    {loading ? "Processing..." : "Update Property"}
                  </button>
                </div>

                <div className="form-container">
                  <h2 className="form-title">Update Property Price</h2>
                  <div className="form-grid">
                    <input
                      className="input"
                      placeholder="Property ID *"
                      type="number"
                      value={priceUpdateForm.propertyId || ""}
                      onChange={(e) => setPriceUpdateForm({...priceUpdateForm, propertyId: parseInt(e.target.value)})}
                    />
                    <input
                      className="input"
                      placeholder="New Price in ETH *"
                      type="number"
                      step="0.001"
                      value={priceUpdateForm.newPrice}
                      onChange={(e) => setPriceUpdateForm({...priceUpdateForm, newPrice: e.target.value})}
                    />
                  </div>
                  <button onClick={updatePrice} className="btn-primary" disabled={loading}>
                    {loading ? "Processing..." : "Update Price"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="section-title">
                  My Reviews ({userReviews.length})
                </h2>
                {userReviews.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">⭐</div>
                    <p>You haven't written any reviews yet.</p>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {userReviews.map((review, idx) => (
                      <div key={idx} className="review-item">
                        <div className="review-header">
                          <div className="review-rating">
                            {"⭐".repeat(review.rating.toNumber())}
                          </div>
                          <span>❤️ {review.likes.toString()}</span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <p className="review-author">
                          Property ID: #{review.productId.toString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
  );
}