var exports = module.exports = {};
exports.sort = sort;

function sort (lst, attr, asc=true) {
  if (lst.length === 1) {
    // return once we hit an array with a single item
    return lst;
  }

  const middle = Math.floor(lst.length / 2); // get the middle item of the rowsay rounded down
  const left = lst.slice(0, middle); // items on the left side
  const right = lst.slice(middle); // items on the right side
  return merge(
      sort(left, attr, asc), 
      sort(right, attr, asc), 
      attr, asc
  );
};

// compare the arrays item by item and return the concatenated result
function merge (left, right, attr, asc) {
  let result = [];
  let indexLeft = 0;
  let indexRight = 0;
    
  if (asc) {
    var compare = function (poke1, poke2) {return poke1[attr] < poke2[attr];};
  }
  else {
    var compare = function (poke1, poke2) {return poke1[attr] > poke2[attr];};
  }

  while (indexLeft < left.length && indexRight < right.length) {
    if (compare(left[indexLeft], right[indexRight])) {
      result.push(left[indexLeft]);
      indexLeft++;
    } else {
      result.push(right[indexRight]);
      indexRight++;
    }
  }

  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
}
