const TestStatic = () => {
  return (
    <div>
      <p>
        This component is loaded statically with a normal import.
        <br />
        🔴 Flexibility (The code of this component is hardcoded in the app
        itself)
        <br />
        🟢 Simplicity (This is what everyone uses all the time)
        <br />
        🟢 Performance (This component is directly part of the bundle)
        <br />
        See ./components/test-static.tsx
      </p>
    </div>
  );
};

export default TestStatic;
