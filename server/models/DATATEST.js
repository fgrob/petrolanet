const db = require("./index");
const Tank = db.tank;
const Operation = db.operation;
const User = db.user;
const Client = db.client;
const Supplier = db.supplier;

const initial = () => {
  Tank.create({
    type: "estanque",
    name: "PRINCIPAL20",
    capacity: 21000,
    current_quantity: 9000,
    tank_gauge: true,
    // measured_quantity: 0,  ...default value 0
    // tank_number: 0, ...default value 0
    // tank_speed: 0 ...default value 0
    status: "DISPONIBLE",
    timestamp_current_quantity: db.Sequelize.fn("NOW"),
    timestamp_measured_quantity: db.Sequelize.fn("NOW"),
  });

  Tank.create({
    type: "estanque",
    name: "SECUNDARIO50",
    capacity: 50000,
    current_quantity: 45000,
    tank_gauge: true,
    status: "DISPONIBLE",
    timestamp_current_quantity: db.Sequelize.fn("NOW"),
    timestamp_measured_quantity: db.Sequelize.fn("NOW"),
  });

  Tank.create({
    type: "estanque movil",
    name: "bidon2000",
    capacity: 1000,
    current_quantity: 500,
    tank_gauge: false,
    status: "DISPONIBLE",
    timestamp_current_quantity: db.Sequelize.fn("NOW"),
    timestamp_measured_quantity: db.Sequelize.fn("NOW"),
  });

  Tank.create({
    type: "camion",
    name: "FAW",
    capacity: 6000,
    current_quantity: 5500,
    tank_gauge: true,
    status: "DISPONIBLE",
    timestamp_current_quantity: db.Sequelize.fn("NOW"),
    timestamp_measured_quantity: db.Sequelize.fn("NOW"),
  });

  Operation.create({
    name: "CARGA",
  });

  Operation.create({
    name: "DESCARGA",
  });

  Operation.create({
    name: "TRASPASO",
  });

  Operation.create({
    name: "AJUSTE",
  });

  Operation.create({
    name: "MEDICION",
  });

  User.create({
    username: "admin",
    password: "1234",
    email: "admin@admin.cl",
    cellphone: "1234",
  });

  Client.create({
    rut: "17659844-k",
    business_name: "CONSTRUCTORA APIA S.A",
    alias: "APIA",
  });

  Client.create({
    rut: "17567432-7",
    business_name: "ELECTRODOMÉSTICOS ELECTRO S.A",
    alias: "ELECTRO",
  });

  Client.create({
    rut: "18236788-3",
    business_name: "FERRETERÍA LA LLAVE S.A",
    alias: "LA LLAVE",
  });

  Client.create({
    rut: "18975431-0",
    business_name: "PANADERÍA DELICIAS S.A",
    alias: "DELICIAS",
  });

  Client.create({
    rut: "16893245-1",
    business_name: "TALLER MECÁNICO RÁPIDO S.A",
    alias: "RÁPIDO",
  });

  Client.create({
    rut: "19384756-5",
    business_name: "PAPELERÍA ARTÍSTICA COLOR S.A",
    alias: "COLOR",
  });

  Client.create({
    rut: "17234567-8",
    business_name: "RESTAURANTE GOURMET S.A",
    alias: "GOURMET",
  });

  Client.create({
    rut: "18456987-2",
    business_name: "TIENDA DE ROPA MODA URBANA S.A",
    alias: "MODA URBANA",
  });

  Client.create({
    rut: "19876543-1",
    business_name: "LIBRERÍA LECTOR INTELIGENTE S.A",
    alias: "LECTOR INTELIGENTE",
  });

  Client.create({
    rut: "17778899-0",
    business_name: "FARMACIA SALUD TOTAL S.A",
    alias: "SALUD TOTAL",
  });

  Client.create({
    rut: "19123456-4",
    business_name: "CAFETERÍA AROMA FRESCO S.A",
    alias: "AROMA FRESCO",
  });

  Client.create({
    rut: "17098765-3",
    business_name: "TALLER ELÉCTRICO VOLTIO S.A",
    alias: "VOLTIO",
  });

  Client.create({
    rut: "18654321-9",
    business_name: "AUTOMOTORA RÁPIDO Y FURIOSO S.A",
    alias: "RÁPIDO Y FURIOSO",
  });

  Client.create({
    rut: "17432198-6",
    business_name: "SUPERMERCADO TODOBARATO S.A",
    alias: "TODOBARATO",
  });

  Client.create({
    rut: "18087654-8",
    business_name: "PAPELERÍA ARTÍSTICA COLORIDO S.A",
    alias: "COLORIDO",
  });

  Supplier.create({
    rut: "89457890-0",
    business_name: "ENEX S.A",
    alis: "ENEX",
  });

  Supplier.create({
    rut: "17659000-5",
    business_name: "SUMINISTROS INDUSTRIALES S.A",
    alias: "SUMINISTROS",
  });

  Supplier.create({
    rut: "17560000-8",
    business_name: "MATERIALES DE CONSTRUCCIÓN S.A",
    alias: "MATERIALES",
  });

  Supplier.create({
    rut: "18238777-4",
    business_name: "FERRETERÍA HERRAMIENTAS S.A",
    alias: "HERRAMIENTAS",
  });
};

module.exports = initial;
