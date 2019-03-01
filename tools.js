var exports = module.exports = {};
exports.mergeSort = mergeSort;

function mergeSort (rows, col, asc=true) {
  if (rows.length === 1) {
    // return once we hit an array with a single item
    return rows;
  }

  const middle = Math.floor(rows.length / 2); // get the middle item of the rowsay rounded down
  const left = rows.slice(0, middle); // items on the left side
  const right = rows.slice(middle); // items on the right side
  return merge(
      mergeSort(left, col, asc), 
      mergeSort(right, col, asc), 
      col, asc
  );
};

// compare the arrays item by item and return the concatenated result
function merge (left, right, col, asc) {
  let result = [];
  let indexLeft = 0;
  let indexRight = 0;
    
  if (asc) {
    var compare = function (item1, item2) {return item1 < item2;};
  }
  else {
    var compare = function (item1, item2) {return item1 > item2;};
  }

  while (indexLeft < left.length && indexRight < right.length) {
    if (compare(left[indexLeft][col], right[indexRight][col])) {
      result.push(left[indexLeft]);
      indexLeft++;
    } else {
      result.push(right[indexRight]);
      indexRight++;
    }
  }

  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
}
