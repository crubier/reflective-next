const TestSource = () => {
  return (
    <div className="prose">
      <p>
        This component is loaded dynamically from a source Typescript file, the
        classic way for dynamic imports in NextJS.
        <br />
        🟡 Flexibility (This can be loaded whenever we want thanks to
        code-splitting)
        <br />
        🟢 Simplicity (This is the simple, well documented way to load things
        dynamically)
        <br />
        🟢 Performance (Only loading required at run-time, can be preloaded
        automatically with webpack)
        <br />
        See{" "}
        <a href="https://github.com/crubier/reflective-next/blob/main/components/test-source.tsx">
          ./components/test-source.tsx
        </a>
      </p>
    </div>
  );
};

export default TestSource;
