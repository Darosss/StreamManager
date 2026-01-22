export const getFilterForMap = <Model>(fieldName: keyof Model, regex: string, options: "i" = "i") => {
  const fieldNameStr = `$${String(fieldName)}`;

  return {
    $expr: {
      $gt: [
        {
          $size: {
            $filter: {
              input: { $objectToArray: `$${fieldNameStr}` },
              as: "item",
              cond: {
                $regexMatch: {
                  input: "$$item.v",
                  regex,
                  options
                }
              }
            }
          }
        },
        0
      ]
    }
  };
};
