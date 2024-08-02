import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HomePageProductCard from './HomePageProductCard';
import { Product, ApiResponse } from '../../types/types';
import { SectionHeader } from '../../theme/customStyles';
import { useNavigate } from 'react-router-dom';

const NewArrivalsProductDisplay: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const maxVisibleSlides = 5;
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        'http://localhost:5001/api/products?limit=10&sort=newest'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      // 假设从后端获取的数据是按照创建日期排序的
      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('无法加载产品，请稍后重试。');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      Math.min(prev + maxVisibleSlides, products.length - maxVisibleSlides)
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - maxVisibleSlides, 0));
  };

  const handleProductClick = (id: number) => {
    navigate(`/products/${id}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        // maxWidth="lg"
        sx={{
          overflow: 'hidden',
          border: '2px solid black',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            margin: '0 72px',
            height: '120px',
            border: '2px solid yellow',
          }}
        >
          <SectionHeader
            sx={{
              position: 'relative',
              top: '52px',
              left: '0',
              transform: 'translateX(0%)',
              border: '1px solid yellow',
              width: '350px',
              Height: '40px',
            }}
          >
            New Arrivals{' '}
          </SectionHeader>
        </Box>
        <Box
          sx={{
            position: 'relative',
            border: '2px solid blue',
            overflow: 'hidden',
            margin: '0 72px',
          }}
        >
          {error && (
            <Typography
              color="error"
              sx={{ textAlign: 'center', marginTop: 2 }}
            >
              {error}
            </Typography>
          )}
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '0',
              transform: 'translateY(-50%)',
              zIndex: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Box
            ref={sliderRef}
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentSlide * (240 + 24)}px)`,
              border: '2px solid pink',
              width: 'calc(100% - 144px)', // Adjust to account for the margin
            }}
          >
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  width: '240px',
                  height: '336px',
                  flexShrink: 0,
                  marginRight: '16px',
                  marginLeft: '16px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <HomePageProductCard
                  product={product}
                  onClick={() => handleProductClick(product.id)}
                />
              </Box>
            ))}
          </Box>
          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              right: '0',
              transform: 'translateY(-50%)',
              zIndex: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default NewArrivalsProductDisplay;
