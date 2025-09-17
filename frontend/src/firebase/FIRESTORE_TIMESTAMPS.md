# Firebase Firestore Timestamp Guide

## Server Timestamps in Firestore

### Supported Locations
- Server timestamps (`serverTimestamp()`) are only supported at the document's root level or in nested objects.
- They **cannot** be used directly inside arrays.

### How to Handle Timestamps in Arrays
For timestamp fields inside arrays, you have two options:

1. **Use JavaScript Date objects**:
   ```javascript
   arrayField.push({
     field1: value1,
     timestamp: new Date() // Use JavaScript Date instead of serverTimestamp()
   });
   ```

2. **Use a map with serverTimestamp** (if you need server-side timestamps):
   ```javascript
   // Instead of pushing directly to an array, create a map where keys are auto-generated IDs
   // and values are objects that can contain serverTimestamp
   await updateDoc(docRef, {
     [`questions.${generateId()}`]: {
       question: "Question text",
       answer: "Answer text",
       timestamp: serverTimestamp()
     }
   });
   ```

### Best Practices
1. **Consistency**: Use the same timestamp format (either client-side or server-side) throughout your application
2. **Documentation**: Comment your code to clarify which approach you're using
3. **Error Handling**: Always implement proper error handling for Firestore operations

### Common Issues
- `Function updateDoc() called with invalid data. serverTimestamp() is not currently supported inside arrays` error occurs when trying to use `serverTimestamp()` inside an array
- Time discrepancies can occur if mixing client-side dates and server timestamps

For more information, check the [Firebase documentation](https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp).