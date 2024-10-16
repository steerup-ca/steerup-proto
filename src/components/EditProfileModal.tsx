import React, { useState } from 'react';
import { User, Address } from '../types';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState<Address>(user.address);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name,
      email,
      address,
    };
    onSave(updatedUser);
  };

  const inputStyle = "w-full p-2 border rounded";
  const labelStyle = "block mb-2 font-semibold";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl" style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)' }}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={labelStyle}>Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputStyle}
                  style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelStyle}>Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputStyle}
                  style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                />
              </div>
              <div>
                <label htmlFor="street" className={labelStyle}>Street</label>
                <input
                  type="text"
                  id="street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className={inputStyle}
                  style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                />
              </div>
              <div>
                <label htmlFor="city" className={labelStyle}>City</label>
                <input
                  type="text"
                  id="city"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className={inputStyle}
                  style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                />
              </div>
              <div>
                <label htmlFor="provinceState" className={labelStyle}>Province/State</label>
                <input
                  type="text"
                  id="provinceState"
                  value={address.provinceState}
                  onChange={(e) => setAddress({ ...address, provinceState: e.target.value })}
                  className={inputStyle}
                  style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                />
              </div>
              <div>
                <label htmlFor="postalCodeZip" className={labelStyle}>Postal Code/Zip</label>
                <input
                  type="text"
                  id="postalCodeZip"
                  value={address.postalCodeZip}
                  onChange={(e) => setAddress({ ...address, postalCodeZip: e.target.value })}
                  className={inputStyle}
                  style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="country" className={labelStyle}>Country</label>
                <input
                  type="text"
                  id="country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className={inputStyle}
                  style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="mr-4 px-6 py-2 rounded transition-colors duration-200"
                style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--button-text-color)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded transition-colors duration-200"
                style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
