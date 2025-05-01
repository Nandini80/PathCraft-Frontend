import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiTag, FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { deleteItinerary } from '../../services/api';

const ItineraryCard = ({ itinerary }) => {
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState('');

  // Use the image URL from the response
  useEffect(() => {
    const fetchedImageUrl = "https://images.unsplash.com/photo-1511966344804-3847f3b298c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDU0Njh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDYwOTM2MzN8&ixlib=rb-4.0.3&q=80&w=1080";
    setImageUrl(fetchedImageUrl); // Set the image URL
  }, [itinerary.region]);

  // Setup mutation for delete operation
  const deleteMutation = useMutation(deleteItinerary, {
    onSuccess: () => {
      queryClient.invalidateQueries('itineraries');
      toast.success('Itinerary deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete itinerary');
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      deleteMutation.mutate(itinerary.id);
    }
  };

  return (
    <Link to={`/itineraries/${itinerary.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg h-full flex flex-col">
        <div className="relative h-48">
          <img
            src={imageUrl} // Use the fetched image URL
            alt={itinerary.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg">
            {itinerary.nights} Nights
          </div>
          
          {itinerary.is_recommended && (
            <div className="absolute top-0 left-0 bg-amber-500 text-white px-3 py-1 rounded-br-lg flex items-center">
              <FiStar className="mr-1" /> Recommended
            </div>
          )}
        </div>
        
        <div className="p-4 flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{itinerary.name}</h3>
          
          <p className="text-gray-600 mb-3 line-clamp-2">{itinerary.description}</p>
          
          <div className="flex items-center text-gray-500 mb-3">
            <FiMapPin className="mr-1" /> 
            <span>{itinerary.region}</span>
          </div>
          
          {itinerary.highlights && itinerary.highlights.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Highlights:</h4>
              <p className="text-gray-600 text-sm line-clamp-1">
                {itinerary.highlights.join(', ')}
              </p>
            </div>
          )}
          
          {itinerary.tags && itinerary.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {itinerary.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <FiTag className="mr-1" size={10} /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-blue-600 font-medium">
              ${itinerary.price_estimate?.toFixed(2) || 'N/A'}
            </div>
            
            <div className="flex space-x-2">
              <Link 
                to={`/itineraries/edit/${itinerary.id}`}
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <FiEdit className="text-gray-600" />
              </Link>
              
              <button 
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={handleDelete}
              >
                <FiTrash2 className="text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItineraryCard;