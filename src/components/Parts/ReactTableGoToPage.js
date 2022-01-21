const ReactTableGoToPage = ({ pageIndex, gotoPage }) => {
  return (
    <>
      <span>
        | Go to page:{" "}
        <input
          type="number"
          value={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          style={{ width: "100px" }}
        />
      </span>{" "}
    </>
  );
};

export default ReactTableGoToPage;
