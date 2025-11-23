import React from 'react'
import { FaBuilding, FaCheckCircle, FaEdit, FaStreetView, FaTrash, FaUser } from 'react-icons/fa';
import { MdLocationCity, MdPinDrop, MdPublic } from "react-icons/md";

const AddressList = ({ addresses = [], onEdit, onDelete, selectedAddressId, onSelect }) => {
  return (
    <div className='space-y-4'>
      {(addresses || []).map((address) => (
        <div
          key={address.addressId || address.id}
          onClick={() => onSelect?.(address)}
          className={`p-4 border rounded-md cursor-pointer relative ${((address.addressId || address.id) === selectedAddressId) ? 'bg-green-100 border-green-300' : 'bg-white'}`}>
          <div className="flex items-start">
            <div className="space-y-1">
              <div className="flex items-center ">
                <FaBuilding size={14} className='mr-2 text-gray-600' />
                <p className='font-semibold'>{address.label || 'Address'}</p>
                {/* 固定勾选图标占位：无选择时也预留空间，保证 Default 文案位置稳定 */}
                <span className='ml-2 inline-flex items-center justify-center w-4 h-4'>
                  {((address.addressId || address.id) === selectedAddressId) ? (
                    <FaCheckCircle className='text-green-500' size={16} />
                  ) : (
                    <span className='inline-block w-4 h-4'></span>
                  )}
                </span>
                {address.isDefault && (
                  <span className='ml-2 text-xs font-medium text-green-700'>Default</span>
                )}
              </div>

              <div className="flex items-center ">
                <FaUser size={14} className='mr-2 text-gray-600' />
                <p>{address.name}</p>
              </div>

              <div className="flex items-center ">
                <FaStreetView size={17} className='mr-2 text-gray-600' />
                <p>{address.street}</p>
              </div>

              <div className="flex items-center ">
                <MdLocationCity size={17} className='mr-2 text-gray-600' />
                <p>{address.city}, {address.state}</p>
              </div>

              <div className="flex items-center ">
                <MdPinDrop size={17} className='mr-2 text-gray-600' />
                <p>{address.zipCode}</p>
              </div>

              <div className="flex items-center ">
                <MdPublic size={17} className='mr-2 text-gray-600' />
                <p>{address.country}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 absolute top-4 right-2">
            <button onClick={(e) => { e.stopPropagation(); onEdit?.(address); }} className="cursor-pointer">
              <FaEdit size={18} className="text-teal-700" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete?.(address); }} className="cursor-pointer">
              <FaTrash size={17} className="text-rose-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddressList;