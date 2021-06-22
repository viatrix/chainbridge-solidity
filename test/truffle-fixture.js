const Migrations = artifacts.require("Migrations");

module.exports = async () => {
    console.log(await Migrations.new.call({gas: 8000000}));
    const migrations = await Migrations.new({gas: 8000000});
    Migrations.setAsDeployed(migrations);
  }