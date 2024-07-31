import React from 'react';
import { Card, CardContent, CardMedia } from '@mui/material';
import { Product } from '../../types/types';
import { BodyText } from '../../theme/customStyles';

interface ProductionCardProps {
  product: Product;
  onClick: () => void;
}

const ProductionCard: React.FC<ProductionCardProps> = ({
  product,
  onClick,
}) => {
  return (
    <Card
      sx={{
        width: '240px',
        height: '336px',
        borderRadius: '8px',
        mb: 2,
        overflow: 'hidden', // 确保圆角对图片生效
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="240px"
        width="240px"
        image="images/test.jpg"
        alt={product.name}
        sx={{
          borderRadius: '8px 8px 0 0', // 只对顶部的圆角生效
        }}
      />
      <CardContent sx={{ padding: '16px' }}>
        <BodyText
          style={{
            fontWeight: 600,
            fontSize: '1.25rem',
            marginBottom: '0.5rem',
          }}
        >
          {product.name}
        </BodyText>
        <BodyText style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {product.description}
        </BodyText>
        <BodyText
          style={{ fontWeight: 500, fontSize: '1.125rem', margin: '0.5rem 0' }}
        >
          ${product.price}
        </BodyText>
        <BodyText style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {product.brand} | {product.category}
        </BodyText>
        <BodyText style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          Quantity: {product.quantity}{' '}
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </BodyText>
      </CardContent>
    </Card>
  );
};

export default ProductionCard;
