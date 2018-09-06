module.exports = function (pool) {

  async function checkGreet(name, language) {


    if (name != '') {
      let result = await pool.query('select * from greetings where name = $1', [name]);

      if (result.rowCount === 0) {
        await pool.query('INSERT INTO greetings (name, counter) values ($1, $2)', [name, 0]);
      }
      await pool.query('UPDATE greetings SET counter = counter + 1 WHERE name = $1', [name]);
    }

    if (language === "English") {
      return 'Hello ' + name;
    }
    if (language === "Spanish") {
      return 'Hola ' + name;
    }
    if (language === "French") {
      return 'Bonjour ' + name;

    }

  }
  async function names(){
    let names = await pool.query('select name from greetings')
    return names.rows;
  }

  async function count() {
    let result = await pool.query('SELECT * FROM greetings');
    return result.rowCount
  }
  
  async function reset(){
    let reset = await pool.query('delete from greetings');
    return reset

  }

  async function oneName(Myname){
    let results = await pool.query('select * from greetings where name =$1', [Myname]);
    return results.rows[0];
  }

  

  return {
    checkGreet,
    count,
    names,
    reset,
    oneName,
  }
}
