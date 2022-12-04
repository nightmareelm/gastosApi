const db = require("../models");
const Gastos = db.gastos;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.tituloGasto) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const allowedOrigins = ['http://localhost:8080'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");


  // Create a Gasto
  const gasto = new Gastos({
    tituloGasto: req.body.tituloGasto,
    cantidad: req.body.cantidad,
    fecha: req.body.fecha,
    establecimiento: req.body.establecimiento,
    comentario: req.body.comentario
  });

  // Save Tutorial in the database
  gasto
    .save(gasto)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.tituloGasto;
  var condition = title ? { tituloGasto: { $regex: new RegExp(title), $options: "i" } } : {};

  res.setHeader('Access-Control-Allow-Origin', '*');

  var pageNo = parseInt(req.query.pageNo);
  var size = parseInt(req.query.size);
  var query = {}
  if (pageNo < 0 || pageNo === 0) {
    response = { "error": true, "message": "pagina invalida, de comenzar con 1" };
    return res.json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;

  /*Gastos.find({}, {}, condition, query)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Algo ocurrio al traer la información"
      });
    });*/

  Gastos.countDocuments({}, function (err, total) {
    Gastos.find({}, {}, query, function (err, data) {
      if (err) {
        response = { "error": true, "message": "Error fetching data" };
      } else {
        var totalPages = Math.ceil(total / size);
        response = { "error": false, "message": data, "pages": totalPages };
      }
      res.json(response);
    });
  });

};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Gastos.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Gastos.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Gastos.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Gastos.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Gastos.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
