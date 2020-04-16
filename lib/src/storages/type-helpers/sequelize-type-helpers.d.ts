import { Sequelize as SequelizeType, Model as ModelClass } from 'sequelize';
interface ModelTempInterface extends ModelClass {
    [key: string]: any;
}
declare type ModelClassType = (typeof ModelClass) & ({
    new (values?: object, options?: any): ModelTempInterface;
});
export { SequelizeType, ModelClassType };
