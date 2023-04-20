import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import Product from '../typeorm/entities/Product';

// interface que define os tipos dos dados do produto
interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  //função assincrona para criação dos produtos, onde recebe os dados abaixo como parametro
  // utilizamos desestruturação para separar as variaveis que vamos manipular
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    //resgatando o repositorio customizado que criamos para fazer as queries
    const productsRepository = getCustomRepository(ProductRepository);
    //verificando se ja existe algum produto no banco com esse nome
    const productExists = await productsRepository.findByName(name);

    //caso exista disparamos um erro no modelo que criamos na classe AppError
    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    //criamos o produto, nao usamos await aqui pois ele apenas monta a entidade
    const product = productsRepository.create({
      name,
      price,
      quantity,
    });

    //agora salvamos efetivamente no banco a criação do produto
    await productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
