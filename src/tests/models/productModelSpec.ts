import { ProductRepository } from '../../models/Product';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let testProductId: number;

  beforeAll(async () => {
    productRepository = new ProductRepository();

    const testProduct = {
      name: 'TestProduct',
      price: '10.99',
      category: 'TestCategory',
    };

    const createdProduct = await productRepository.createProduct(testProduct);
    testProductId = createdProduct.id;
  });

  // getAllProducts
  it('gets all products', async () => {
    const products = await productRepository.getAllProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  // getProductById
  it('gets product by ID', async () => {
    const product = await productRepository.getProductById(testProductId);
    expect(product.id).toEqual(testProductId);
  });

  it('throws error if product not found', async () => {
    try {
      await productRepository.getProductById(999);
      throw new Error('Expected promise to be rejected.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  // getProductsByCategory
  it('gets products by category', async () => {
    const products =
      await productRepository.getProductsByCategory('TestCategory');
    products.forEach((product) => {
      expect(product.category).toEqual('TestCategory');
    });
  });

  // createProduct
  it('creates a new product', async () => {
    const newProduct = {
      name: 'NewProduct',
      price: '19.99',
      category: 'NewCategory',
    };

    const createdProduct = await productRepository.createProduct(newProduct);
    expect(createdProduct.name).toEqual(newProduct.name);
    expect(createdProduct.price).toEqual(newProduct.price);
    expect(createdProduct.category).toEqual(newProduct.category);
  });

  it('throws error if product to delete not found', async () => {
    try {
      await productRepository.deleteProduct(999);
      throw new Error('Expected promise to be rejected.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
