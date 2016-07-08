# address-book-converter
```
Usage: convertaddressbook <source/file.sqlite> <target/file.vcf>
```

## Example code
```typescript
import AddressBookConverter from "address-book-converter";

import * as fs from "fs";

let converter = new AddressBookConverter(sqlitePath);

converter.start((cards) => {
    fs.writeFileSync(targetPath,cards);
})
```
