using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProductApi.Migrations
{
    /// <inheritdoc />
    public partial class addressupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Locality",
                table: "Address",
                newName: "Colony");

            migrationBuilder.RenameColumn(
                name: "Add",
                table: "Address",
                newName: "Area");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Colony",
                table: "Address",
                newName: "Locality");

            migrationBuilder.RenameColumn(
                name: "Area",
                table: "Address",
                newName: "Add");
        }
    }
}
