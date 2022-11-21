module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        tituloGasto: String,
        cantidad: Number,
        fecha: String,
        establecimiento: String,
        comentario: String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Gastos = mongoose.model("gastos", schema);
    return Gastos;
  };
  