const TableWrapper = ({ children }) => {
  return (
    <div className="border-md3-outline-variant rounded-md3-md w-full overflow-x-auto border">
      <table className="md3-table">{children}</table>
    </div>
  )
}

export default TableWrapper
