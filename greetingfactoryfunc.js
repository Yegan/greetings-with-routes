module.exports = function (pool) {
  // the checkGreet async function adds name into the database
  async function checkGreet (name, language) {
    if (name != '') {
      let result = await pool.query('select * from greetings where LOWER(name) = $1', [name.toLowerCase()])
      if (result.rows.length === 0) {
        await pool.query('INSERT INTO greetings (name, counter) values ($1, $2)', [name.toLowerCase(), 1])
      } else {
        await pool.query('UPDATE greetings SET counter = counter + 1  WHERE name = LOWER($1)', [name.toLowerCase()])
      }
    }

    if (language === 'English') {
      return 'Hello ' + name
    }
    if (language === 'Spanish') {
      return 'Hola ' + name
    }
    if (language === 'French') {
      return 'Bonjour ' + name
    }
  }
  // the names function gets all the names from the database

  async function names () {
    let names = await pool.query('select name from greetings')
    return names.rows
  }

  // the count function gets the count table from the database

  async function count () {
    let result = await pool.query('select * FROM greetings')
    console.log(result.rowCount)
    return result.rowCount
  }

  // the reset function deletes all entries in the database
  async function reset () {
    let reset = await pool.query('delete from greetings')
    return reset
  }

  // the oneName function gets the rows from the table

  async function oneName (Myname) {
    let results = await pool.query('select * from greetings where name =$1', [Myname])
    return results.rows[0]
  }

  return {
    checkGreet,
    count,
    names,
    reset,
    oneName
  }
}
