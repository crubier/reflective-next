const TestStatic = () => {
  return (
    <div className="prose">
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
        See{" "}
        <a href="https://github.com/crubier/reflective-next/blob/main/components/test-static.tsx">
          ./components/test-static.tsx
        </a>
      </p>
    </div>
  );
};

export default TestStatic;
